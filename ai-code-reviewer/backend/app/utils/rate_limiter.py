from collections import defaultdict
from datetime import datetime, timedelta
from fastapi import HTTPException, Request
from app.config import get_settings

class RateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)
        self.settings = get_settings()
    
    def check_rate_limit(self, client_ip: str):
        now = datetime.utcnow()
        hour_ago = now - timedelta(hours=1)
        
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if req_time > hour_ago
        ]
        
        if len(self.requests[client_ip]) >= self.settings.rate_limit_per_hour:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Maximum {self.settings.rate_limit_per_hour} requests per hour."
            )
        
        self.requests[client_ip].append(now)
        return True

rate_limiter = RateLimiter()

async def check_rate_limit_dependency(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    rate_limiter.check_rate_limit(client_ip)
    return client_ip
