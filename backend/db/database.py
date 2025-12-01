
from pymongo import AsyncMongoClient

from core.config import configs

client = None
db = None

async def db_connect():
    global client, db
    client = AsyncMongoClient(configs.DATABASE_URL, tz_aware=True)
    db = client[configs.DATABASE_NAME]
    # init db
    await init_db()

async def db_disconnect():
    global client
    await client.close()

def get_db():
    return db

def get_client():
    return client

async def init_db():
    await db.roles.create_index([("name")], unique=True)
    await db.users.create_index([("username")], unique=True)