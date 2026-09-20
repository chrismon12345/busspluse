from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = 'sqlite:///./busplus.db'
    SECRET_KEY: str = 'busplus-secret-key-change-in-production'
    MOCK_AI: bool = True
    ISSUE_CLUSTER_RADIUS_METERS: float = 20.0
    FRAME_SKIP: int = 5
    MODEL_PATH: str = 'ai/models/best.pt'
    JWT_ALGORITHM: str = 'HS256'
    JWT_EXPIRATION_MINUTES: int = 1440
    CORS_ORIGINS: List[str] = ['http://localhost:5173', 'http://localhost:3000']

    class Config:
        env_file = ".env"

settings = Settings()
