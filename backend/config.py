from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/crypto_tracker"

    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24

    # Security
    SECRET_KEY_PASSLIB: str = "your-passlib-secret-key-change-this"

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # Server
    DEBUG: bool = True

    class Config:
        env_file = ".env"

    @property
    def origins_list(self) -> list[str]:
        return self.ALLOWED_ORIGINS.split(",")


@lru_cache()
def get_settings() -> Settings:
    return Settings()
