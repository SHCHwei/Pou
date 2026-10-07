from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase

from app.config import get_settings

client: AsyncMongoClient | None = None
db: AsyncDatabase | None = None


async def connect_db() -> None:
    """應用程式啟動時呼叫，建立連線。"""
    global client, db
    settings = get_settings()
    client = AsyncMongoClient(settings.mongodb_url)
    db = client[settings.mongo_database] if settings.mongo_database else client.get_default_database()
    await ping()


async def ping() -> None:
    if client is None:
        raise RuntimeError("Database is not initialized")
    await client.admin.command("ping")


async def close_client() -> None:
    """應用程式關閉時呼叫，釋放連線。"""
    global client, db
    if client is not None:
        await client.close()
    client = None
    db = None


def get_database() -> AsyncDatabase:
    if db is None:
        raise RuntimeError("Database is not initialized")
    return db
