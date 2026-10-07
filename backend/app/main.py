from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import connect_db, close_client, ping
from app.routers import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to the database...")
    await connect_db()
    yield
    print("Closing the database connection...")
    await close_client()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/database-health")
async def database_health() -> dict[str, str]:
    await ping()
    return {"status": "ok"}
