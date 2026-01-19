from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.exc import SQLAlchemyError
import uuid
import asyncio
from datetime import datetime

# Import models and services
from app.models import ReviewRequest, ReviewResponse, Score
from app.services.ai_service import ai_reviewer
from app.services.history_service import ReviewHistoryService
from app.utils.auth import optional_auth
from app.utils.rate_limit import RateLimiter

router = APIRouter()

# Global rate limiter instance
rate_limiter = RateLimiter(requests_per_minute=5)

@router.post("/review", response_model=ReviewResponse)
async def create_review(
    request: ReviewRequest,
    req: Request,
    user=Depends(optional_auth)
):
    """
    Submit code for AI review and mentoring
    """
    # Check rate limiting
    client_ip = req.client.host
    if not await rate_limiter.check_rate_limit(client_ip):
        reset_time = await rate_limiter.get_time_until_reset(client_ip)
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Try again in {reset_time} seconds.",
            headers={"Retry-After": str(reset_time)}
        )
    
    try:
        # Generate unique review ID
        review_id = str(uuid.uuid4())
        
        # Run AI analysis in background to not block
        ai_task = asyncio.create_task(
            ai_reviewer.analyze_code(
                code=request.code,
                language=request.language,
                skill_level=request.skill_level,
                focus=request.focus
            )
        )
        
        # Wait for AI analysis with timeout
        try:
            review_data = await asyncio.wait_for(ai_task, timeout=30.0)
        except asyncio.TimeoutError:
            raise HTTPException(
                status_code=504,
                detail="AI analysis timeout. Please try with simpler code or try again later."
            )
        
        # Add metadata to review data
        review_data.update({
            "review_id": review_id,
            "code": request.code,
            "language": request.language,
            "skill_level": request.skill_level,
            "focus": request.focus,
            "timestamp": datetime.utcnow()
        })
        
        # Save to database
        history_service = ReviewHistoryService()
        try:
            history_service.create_review(review_data)
        except Exception as e:
            print(f"Error saving review to database: {e}")
            # Continue without saving to database
        finally:
            history_service.close()
        
        # Format response
        response = ReviewResponse(
            review_id=review_data["review_id"],
            code=review_data["code"],
            language=review_data["language"],
            skill_level=review_data["skill_level"],
            focus=review_data["focus"],
            timestamp=review_data["timestamp"],
            score=Score(**review_data["score"]),
            issues=review_data.get("issues", []),
            improved_code=review_data["improved_code"],
            mentor_explanation=review_data["mentor_explanation"],
            follow_up_questions=review_data.get("follow_up_questions", [])
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in create_review: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during code review"
        )