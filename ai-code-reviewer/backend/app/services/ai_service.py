import httpx
import logging
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

async def analyze_code(code: str, language: str, skill_level: str, focus_areas: list):
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{settings.ai_agent_url}/analyze",
                json={
                    "code": code,
                    "language": language,
                    "skill_level": skill_level,
                    "focus_areas": focus_areas,
                },
                headers={
                    "X-API-Key": settings.ai_agent_api_key,
                }
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        logger.error(f"Error calling AI agent: {str(e)}")
        raise Exception(f"AI service error: {str(e)}")
