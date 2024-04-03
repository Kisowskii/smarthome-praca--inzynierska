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
