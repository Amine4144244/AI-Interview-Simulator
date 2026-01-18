from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from agent import router as agent_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Interview Simulator Agent",
    description="AI agent for generating interview questions and evaluating answers",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Backend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include agent router
app.include_router(agent_router, prefix="/api", tags=["agent"])

@app.get("/")
async def root():
    return {"message": "AI Interview Simulator Agent API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)