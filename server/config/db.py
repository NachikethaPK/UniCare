import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/unicare")
client = None
db = None

def get_db():
    global client, db
    if client is None:
        client = AsyncIOMotorClient(MONGODB_URI)
        # Parse database name from URI or default to 'unicare'
        try:
            db_name = client.get_default_database().name
        except Exception:
            db_name = "unicare"
        db = client[db_name]
    return db
