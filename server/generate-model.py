import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV, TimeSeriesSplit
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from joblib import dump
import numpy as np

# Wczytaj dane
df = pd.read_csv('./server/activity_logs.csv')

# Przetwarzanie daty i czasu
df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', format='%Y-%m-%dT%H:%M:%S.%fZ')
df['hour'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)

# Kodowanie etykiet
label_encoder = LabelEncoder()
df['state'] = label_encoder.fit_transform(df['state'])

# Definicja cech
features_columns = ['hour', 'day_of_week', 'is_weekend']
scaler = StandardScaler()

# P�tla przez unikalne grupy (userId, deviceId)
for (userId, deviceId), group in df.groupby(['userId', 'deviceId']):
    # Skalowanie cech
    X_scaled = scaler.fit_transform(group[features_columns])
    y = group['state']

    # Definicja modelu i parametr�w
    model = RandomForestClassifier()
    param_distributions = {
        'n_estimators': [100, 200, 300],
        'max_depth': [5, 10, 15, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }

    # U�ycie TimeSeriesSplit dla szereg�w czasowych
    tscv = TimeSeriesSplit(n_splits=5)
    random_search = RandomizedSearchCV(model, param_distributions, n_iter=20, cv=tscv, scoring='accuracy', n_jobs=-1, random_state=42)
    random_search.fit(X_scaled, y)

    # Zapisz model i scaler
    scaler_filename = f'./server/scalers/scaler_user_{userId}_device_{deviceId}.joblib'
    dump(scaler, scaler_filename)
    
    model_filename = f'./server/models/model_user_{userId}_device_{deviceId}.joblib'
    dump(random_search.best_estimator_, model_filename)
    
    print(f"Model for user {userId} and device {deviceId} saved as {model_filename}. Best score: {random_search.best_score_:.2f}")
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

# Load known face encodings and their labels
try:
    with open('face_data.pkl', 'rb') as f:
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
    with open('./server/camera_module/face_data.pkl', 'wb') as f:
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
    if 'face_data.pkl' not in sys.argv:
        face_data = []  # Initialize empty list if face data file doesn't exist
    recognition_thread = threading.Thread(target=recognize_faces_in_background)
    recognition_thread.start()  # Start the face recognition thread immediately
    app.run(host='0.0.0.0', port=5000)
