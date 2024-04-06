import face_recognition
import numpy as np
import os
from sklearn.svm import SVC
import pickle

# Funkcja do �adowania zdj�� twarzy i ich kodowa�
def load_face_encodings(folder_path):
    face_encodings = []
    face_names = []

    for person_name in os.listdir(folder_path):
        person_folder = os.path.join(folder_path, person_name)
        if not os.path.isdir(person_folder):
            continue

        for image_name in os.listdir(person_folder):
            image_path = os.path.join(person_folder, image_name)
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)

            if len(encodings) > 0:
                face_encodings.append(encodings[0])
                face_names.append(person_name)

    return face_encodings, face_names

# �cie�ka do folderu ze zdj�ciami
images_path = './server/camera_module'

# �adowanie kodowa� twarzy
encodings, names = load_face_encodings(images_path)

# Sprawdzenie, czy mamy kodowania twarzy do treningu
if len(encodings) == 0:
    print("Nie znaleziono danych do treningu. Upewnij si�, �e zdj�cia s� poprawne i generuj� kodowania twarzy.")
else:
    # Trening klasyfikatora
    clf = SVC(C=1.0, kernel='linear', probability=True)
    clf.fit(encodings, names)

    # Zapisywanie wytrenowanego modelu
    model_filename = 'faceid_model.clf'
    with open(model_filename, 'wb') as f:
        pickle.dump(clf, f)

    print(f"Model zosta� zapisany jako {model_filename}.")
