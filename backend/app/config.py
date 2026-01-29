from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "SentimentPulse API"
    api_prefix: str = "/api"
    jwt_secret_key: str = "super-secret-key"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expires_minutes: int = 60
    database_url: str = "sqlite:///./sentimentpulse.db"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    return Settings()


