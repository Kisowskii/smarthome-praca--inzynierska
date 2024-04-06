import sys
sys.path.append('/usr/lib/python3/dist-packages')
import time
from flask import Flask, Response, jsonify, request
from picamera2 import Picamera2
import cv2
import face_recognition
import pickle
import threading
from flask_cors import CORS
import logging

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logging.getLogger('picamera2').setLevel(logging.WARNING)

app = Flask(__name__)
CORS(app)  # Enable CORS for the whole app

# Initialize camera
camera = Picamera2()
camera.configure(camera.create_preview_configuration(main={"format": 'XRGB8888', "size": (640, 480)}))
camera.start()

try:
    with open('server/camera_module/face_data.pkl', 'rb') as f:
        face_data = pickle.load(f)
    known_face_encodings = [data['encoding'] for data in face_data]
    known_face_names = [data['name'] for data in face_data]
    logging.debug("Face data loaded successfully.")
except FileNotFoundError:
    logging.error("Face data file not found. Please collect and save face data first.")
    known_face_encodings = []
    known_face_names = []

def recognize_faces_in_background():
    """Continuously checks for known faces in the video feed."""
    while True:
        frame = camera.capture_array()
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.6)
            name = "Unknown"

            if True in matches:
                first_match_index = matches.index(True)
                name = known_face_names[first_match_index]

            if name != "Unknown":
                logging.debug(f'Witaj, {name}!')

        time.sleep(3)  # Check every 3 seconds

def save_face_data(person_id, new_encoding):
    """Saves the collected face encodings."""
    face_data.append({'name': person_id, 'encoding': new_encoding})
    with open('server/camera_module/face_data.pkl', 'wb') as f:
        pickle.dump(face_data, f)
    logging.debug("Face data updated and saved.")

def collect_face_data(duration=2, person_id='unknown'):
    """Collects face data for a specified duration."""
    logging.debug(f"Starting face data collection for person_id: {person_id}.")
    start_time = time.time()
    collected_encodings = 0

    while time.time() - start_time < duration:
        frame = camera.capture_array()
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        for encoding in face_encodings:
            save_face_data(person_id, encoding)
            collected_encodings += 1

    if collected_encodings == 0:
        logging.debug(f"No faces collected for person_id: {person_id}.")
    else:
        logging.debug(f"Collected {collected_encodings} encodings for person_id: {person_id}.")

@app.route('/start_face_collection', methods=['POST'])
def start_face_collection():
    """API endpoint to start face data collection."""
    data = request.json
    person_id = data.get('person_id', 'unknown')  # Use person_id from the request
    duration = data.get('duration', 2)  # Default duration is 2 seconds
    threading.Thread(target=collect_face_data, args=(duration, person_id)).start()
    return jsonify({"message": "Face data collection started"}), 200

@app.route('/video_feed')
def video_feed():
    """Video streaming route."""
    def generate_frames():
        while True:
            frame = camera.capture_array()
            _, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    if 'server/camera_module/face_data.pkl' not in sys.argv:
        face_data = []  # Initialize empty list if face data file doesn't exist
    recognition_thread = threading.Thread(target=recognize_faces_in_background)
    recognition_thread.start()  # Start the face recognition thread immediately
    app.run(host='0.0.0.0', port=5000)