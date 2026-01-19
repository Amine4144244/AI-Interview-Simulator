from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import jwt
from datetime import datetime, timedelta

# For now, we'll use a simple token-based auth system
# In production, you'd want to use proper JWT tokens with user authentication

security = HTTPBearer()

# Simple API key authentication for internal use
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "dev-internal-key-123")

async def verify_internal_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Verify internal API key for agent communication"""
    if credentials.credentials != INTERNAL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal API key",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials

# Mock user authentication - in production this would verify real JWT tokens
async def verify_user_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify user token (mock implementation)"""
    # In a real implementation, you would:
    # 1. Decode the JWT token
    # 2. Verify the signature
    # 3. Check if the token is expired
    # 4. Return user information
    
    # For now, we'll just accept any token and return mock user data
    return {
        "user_id": "mock-user-123",
        "username": "demo_user",
        "email": "demo@example.com"
    }

# Optional authentication - returns user info if token is provided, None otherwise
async def optional_auth(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[dict]:
    """Optional authentication - works with or without token"""
    if not credentials:
        return None
    
    try:
        return await verify_user_token(credentials)
    except HTTPException:
        # If token is invalid, just return None for optional auth
        return None