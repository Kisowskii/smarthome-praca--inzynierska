import sys
from joblib import load
import numpy as np
import pandas as pd

userId = sys.argv[1]
deviceId = sys.argv[2]
hour = int(sys.argv[3])
day_of_week = int(sys.argv[4])
is_weekend = 1 if day_of_week in [5, 6] else 0

model_path = f'./server/models/model_user_{userId}_device_{deviceId}.joblib'
scaler_path = f'./server/scalers/scaler_user_{userId}_device_{deviceId}.joblib'

model = load(model_path)
scaler = load(scaler_path)

# Przygotowanie danych wej�ciowych dla modelu
features_df = pd.DataFrame(data=[[hour, day_of_week, is_weekend]],columns=['hour', 'day_of_week', 'is_weekend'])
features_scaled = scaler.transform(features_df)

prediction = model.predict(features_scaled)
print(prediction[0])
