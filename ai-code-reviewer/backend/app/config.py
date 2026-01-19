from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str = "sqlite:///./code_reviews.db"
    secret_key: str = "dev-secret-key-change-in-production"
    ai_agent_url: str = "http://localhost:8001"
    ai_agent_api_key: str = "dev-api-key"
    rate_limit_per_hour: int = 10
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings():
    return Settings()
