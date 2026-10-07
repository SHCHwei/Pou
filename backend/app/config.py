import os
from dataclasses import dataclass
from functools import lru_cache


@dataclass(frozen=True)
class Settings:
    mongodb_url: str
    mongo_database: str | None


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings(
        mongodb_url=os.environ["MONGODB_URL"],
        mongo_database=os.environ.get("MONGO_DATABASE"),
    )
