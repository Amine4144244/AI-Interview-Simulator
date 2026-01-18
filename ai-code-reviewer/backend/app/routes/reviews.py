from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging

from app.models.database import get_db
from app.models.review import Review
from app.utils.validators import ReviewRequest, ReviewResponse
from app.utils.rate_limiter import check_rate_limit_dependency
from app.services.ai_service import analyze_code

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/reviews", tags=["reviews"])

@router.post("", response_model=ReviewResponse)
async def create_review(
    request: ReviewRequest,
    client_ip: str = Depends(check_rate_limit_dependency),
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Analyzing code for IP: {client_ip}")
        
        ai_result = await analyze_code(
            code=request.code,
            language=request.language,
            skill_level=request.skill_level,
            focus_areas=request.focus_areas
        )
        
        review = Review(
            code=request.code,
            language=request.language,
            skill_level=request.skill_level,
            focus_areas=request.focus_areas,
            issues=ai_result.get("issues", []),
            improved_code=ai_result.get("improved_code", ""),
            explanation=ai_result.get("explanation", ""),
            scores=ai_result.get("scores", {}),
            follow_up_questions=ai_result.get("follow_up_questions", []),
            user_ip=client_ip
        )
        
        db.add(review)
        db.commit()
        db.refresh(review)
        
        return review.to_dict()
        
    except Exception as e:
        logger.error(f"Error creating review: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[ReviewResponse])
async def get_reviews(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    reviews = db.query(Review).order_by(Review.timestamp.desc()).offset(skip).limit(limit).all()
    return [review.to_dict() for review in reviews]

@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(review_id: str, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review.to_dict()
