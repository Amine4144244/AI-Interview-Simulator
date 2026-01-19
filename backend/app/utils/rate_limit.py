from typing import Dict, Optional
from datetime import datetime, timedelta
import asyncio
from collections import defaultdict
import time

class RateLimiter:
    """Simple rate limiter for API endpoints"""
    
    def __init__(self, requests_per_minute: int = 5):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = defaultdict(list)
        self.lock = asyncio.Lock()
    
    async def check_rate_limit(self, client_ip: str) -> bool:
        """Check if client IP is within rate limit"""
        async with self.lock:
            now = time.time()
            minute_ago = now - 60
            
            # Clean old requests
            if client_ip in self.requests:
                self.requests[client_ip] = [
                    req_time for req_time in self.requests[client_ip]
                    if req_time > minute_ago
                ]
            else:
                self.requests[client_ip] = []
            
            # Check if under limit
            if len(self.requests[client_ip]) >= self.requests_per_minute:
                return False
            
            # Add current request
            self.requests[client_ip].append(now)
            return True
    
    async def get_time_until_reset(self, client_ip: str) -> int:
        """Get seconds until rate limit resets for client IP"""
        if client_ip not in self.requests or not self.requests[client_ip]:
            return 0
        
        oldest_request = min(self.requests[client_ip])
        reset_time = oldest_request + 60
        return max(0, int(reset_time - time.time()))