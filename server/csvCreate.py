import pymongo
import pandas as pd
from bson.objectid import ObjectId
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['SmartHome']  
collection = db['activityLogs']  

logs = list(collection.find({}))

df = pd.DataFrame(logs)

df['_id'] = df['_id'].apply(lambda x: str(x))
df['userId'] = df['userId'].apply(lambda x: str(x))
df['deviceId'] = df['deviceId'].apply(lambda x: str(x))

df.to_csv('./server/activity_logs.csv', index=False)

print("Dane zostaly pomyslnie wyeksportowane do pliku CSV.")
