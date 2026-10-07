from pymongo.asynchronous.database import AsyncDatabase

from app.db import get_database


def get_db() -> AsyncDatabase:
    return get_database()
