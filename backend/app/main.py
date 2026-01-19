from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
from dotenv import load_dotenv
import os
from datetime import datetime

# Import routes
from app.routes import review, history
from app.utils.auth import verify_token
from app.utils.rate_limit import RateLimiter

load_dotenv()

# Rate limiter instance
rate_limiter = RateLimiter(requests_per_minute=5)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 AI Code Reviewer & Mentor API starting up...")
    yield
    # Shutdown
    print("👋 AI Code Reviewer & Mentor API shutting down...")

# Create FastAPI app
app = FastAPI(
    title="AI Code Reviewer & Mentor",
    description="Production-ready AI code review platform that acts as a strict senior developer mentor",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server
        "http://localhost:4173",  # Vite preview
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4173"
    ] + (os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else []),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(review.router, prefix="/api", tags=["review"])
app.include_router(history.router, prefix="/api", tags=["history"])

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "AI Code Reviewer & Mentor"
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "AI Code Reviewer & Mentor API",
        "version": "1.0.0",
        "endpoints": {
            "POST /api/review": "Submit code for review",
            "GET /api/history": "Get review history",
            "GET /api/history/{review_id}": "Get specific review",
            "DELETE /api/history/{review_id}": "Delete review",
            "GET /health": "Health check"
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )