from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import List
import os
import logging

from agent import analyze_code_main

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Code Review Agent",
    description="AI-powered code analysis and review service",
    version="1.0.0"
)

API_KEY = os.getenv("AI_AGENT_API_KEY", "dev-api-key")

class AnalyzeRequest(BaseModel):
    code: str
    language: str
    skill_level: str
    focus_areas: List[str]

class AnalyzeResponse(BaseModel):
    issues: List[dict]
    improved_code: str
    explanation: str
    scores: dict
    follow_up_questions: List[str]

def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return True

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_code_endpoint(request: AnalyzeRequest, authorized: bool = Header(default=None, alias="X-API-Key")):
    if authorized != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    try:
        logger.info(f"Received analysis request for {request.language} code")
        result = analyze_code_main(
            code=request.code,
            language=request.language,
            skill_level=request.skill_level,
            focus_areas=request.focus_areas
        )
        return result
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-code-review-agent"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
