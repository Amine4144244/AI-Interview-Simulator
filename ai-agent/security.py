from fastapi import HTTPException, Request, Depends
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get internal API key from environment
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "your-internal-api-key")

# Dependency to verify internal API key
def verify_internal_api_key(request: Request):
    api_key = request.headers.get("x-internal-api-key")
    if api_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid internal API key")
    return api_key