from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.models.database import init_db
from app.routes import reviews

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Code Reviewer API",
    description="Backend API for AI-powered code review and mentoring",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reviews.router)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing database...")
    init_db()
    logger.info("Application started successfully")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-code-reviewer-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
