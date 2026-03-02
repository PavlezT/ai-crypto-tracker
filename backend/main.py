# FastAPI entrypoint for CryptoTracker
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import get_settings
from database import engine, Base
from models import User, UserFavorite

# Create tables on startup
Base.metadata.create_all(bind=engine)

settings = get_settings()

# Import routers (will be created next)
from routers import auth, watchlist


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 CryptoTracker API starting...")
    yield
    # Shutdown
    print("🛑 CryptoTracker API shutting down...")


app = FastAPI(
    title="CryptoTracker API",
    description="API for managing cryptocurrency watchlists",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, tags=["auth"])
app.include_router(watchlist.router, tags=["watchlist"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "CryptoTracker API", "version": "0.1.0"}


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=settings.DEBUG)

