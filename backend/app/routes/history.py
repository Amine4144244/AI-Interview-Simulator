from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.exc import SQLAlchemyError

# Import models and services
from app.models import ReviewHistoryResponse
from app.services.history_service import ReviewHistoryService
from app.utils.auth import optional_auth

router = APIRouter()

@router.get("/history", response_model=ReviewHistoryResponse)
async def get_review_history(
    limit: int = Query(20, ge=1, le=100, description="Number of reviews to return"),
    offset: int = Query(0, ge=0, description="Number of reviews to skip"),
    user=Depends(optional_auth)
):
    """
    Get paginated review history
    """
    try:
        history_service = ReviewHistoryService()
        try:
            history = history_service.get_review_history(limit=limit, offset=offset)
            return ReviewHistoryResponse(**history)
        finally:
            history_service.close()
            
    except Exception as e:
        print(f"Error getting review history: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error retrieving review history"
        )

@router.get("/history/{review_id}")
async def get_review_details(
    review_id: str,
    user=Depends(optional_auth)
):
    """
    Get full details of a specific review
    """
    try:
        history_service = ReviewHistoryService()
        try:
            review = history_service.get_review_by_id(review_id)
            if not review:
                raise HTTPException(
                    status_code=404,
                    detail="Review not found"
                )
            return review
        finally:
            history_service.close()
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting review details: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error retrieving review details"
        )

@router.delete("/history/{review_id}")
async def delete_review(
    review_id: str,
    user=Depends(optional_auth)
):
    """
    Delete a review and all its related data
    """
    try:
        history_service = ReviewHistoryService()
        try:
            deleted = history_service.delete_review(review_id)
            if not deleted:
                raise HTTPException(
                    status_code=404,
                    detail="Review not found"
                )
            return {"message": "Review deleted successfully"}
        finally:
            history_service.close()
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting review: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error deleting review"
        )