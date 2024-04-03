import pandas as pd
import json

# Pr�ba za�adowania danych i automatyczne inferowanie formatu daty
logs = pd.read_csv('./server/activity_logs.csv')
logs['timestamp'] = pd.to_datetime(logs['timestamp'], errors='coerce')

# Dodanie kolumny z godzin�
logs['hour'] = logs['timestamp'].dt.hour

# Wyci�gni�cie unikalnych identyfikator�w urz�dze�
unique_device_ids = logs['deviceId'].unique()

chart_data = []

# Iteracja po ka�dym urz�dzeniu i obliczanie �redniej warto�ci 'state' dla ka�dej godziny
for device_id in unique_device_ids:
    device_logs = logs[logs['deviceId'] == device_id]
    frequency_by_hour = device_logs.groupby('hour')['state'].mean() * 100
    chart_data.append({
        "deviceId": device_id,
        "data": frequency_by_hour.reset_index().to_dict(orient='records')
    })

# Zapisanie danych do pliku JSON
with open('./server/chart_data.json', 'w') as f:
    json.dump(chart_data, f)

print("Dane wykresu zapisane pomy�lnie.")
