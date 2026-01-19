from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import os
from datetime import datetime
from typing import List, Optional

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./reviews.db")

# Create engine
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class
Base = declarative_base()

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ReviewHistoryService:
    """Service for managing review history"""
    
    def __init__(self):
        self.db = SessionLocal()
    
    def create_review(self, review_data: dict) -> str:
        """Create a new review record"""
        try:
            # Import here to avoid circular imports
            from app.models.review import Review, Issue, FollowUpQuestion
            
            # Create review
            review = Review(
                id=review_data["review_id"],
                code=review_data["code"],
                language=review_data["language"],
                skill_level=review_data["skill_level"],
                focus=review_data["focus"],
                correctness_score=review_data["score"]["correctness"],
                readability_score=review_data["score"]["readability"],
                maintainability_score=review_data["score"]["maintainability"],
                performance_score=review_data["score"]["performance"],
                security_score=review_data["score"]["security"],
                overall_score=review_data["score"]["overall"],
                improved_code=review_data["improved_code"],
                mentor_explanation=review_data["mentor_explanation"]
            )
            
            self.db.add(review)
            self.db.commit()
            self.db.refresh(review)
            
            # Add issues
            for issue_data in review_data.get("issues", []):
                issue = Issue(
                    review_id=review.id,
                    line=issue_data.get("line"),
                    severity=issue_data["severity"],
                    issue_type=issue_data["type"],
                    title=issue_data["title"],
                    description=issue_data["description"],
                    explanation=issue_data["explanation"],
                    suggestion=issue_data["suggestion"]
                )
                self.db.add(issue)
            
            # Add follow-up questions
            for question in review_data.get("follow_up_questions", []):
                follow_up = FollowUpQuestion(
                    review_id=review.id,
                    question=question
                )
                self.db.add(follow_up)
            
            self.db.commit()
            return review.id
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    def get_review_history(self, limit: int = 20, offset: int = 0) -> dict:
        """Get paginated review history"""
        try:
            from app.models.review import Review, Issue
            
            # Get reviews with issue counts
            reviews = self.db.query(Review).order_by(Review.timestamp.desc()).offset(offset).limit(limit).all()
            
            history_items = []
            for review in reviews:
                issue_count = len(review.issues) if hasattr(review, 'issues') else 0
                history_items.append({
                    "review_id": review.id,
                    "language": review.language,
                    "skill_level": review.skill_level,
                    "focus": review.focus,
                    "timestamp": review.timestamp,
                    "overall_score": review.overall_score,
                    "issue_count": issue_count
                })
            
            # Get total count
            total = self.db.query(Review).count()
            
            return {
                "reviews": history_items,
                "total": total
            }
            
        except Exception as e:
            raise e
    
    def get_review_by_id(self, review_id: str) -> Optional[dict]:
        """Get full review details by ID"""
        try:
            from app.models.review import Review, Issue, FollowUpQuestion
            
            review = self.db.query(Review).filter(Review.id == review_id).first()
            if not review:
                return None
            
            # Get issues
            issues = self.db.query(Issue).filter(Issue.review_id == review_id).all()
            issue_list = []
            for issue in issues:
                issue_list.append({
                    "line": issue.line,
                    "severity": issue.severity,
                    "type": issue.issue_type,
                    "title": issue.title,
                    "description": issue.description,
                    "explanation": issue.explanation,
                    "suggestion": issue.suggestion
                })
            
            # Get follow-up questions
            follow_ups = self.db.query(FollowUpQuestion).filter(FollowUpQuestion.review_id == review_id).all()
            follow_up_questions = [fq.question for fq in follow_ups]
            
            return {
                "review_id": review.id,
                "code": review.code,
                "language": review.language,
                "skill_level": review.skill_level,
                "focus": review.focus,
                "timestamp": review.timestamp,
                "score": {
                    "correctness": review.correctness_score,
                    "readability": review.readability_score,
                    "maintainability": review.maintainability_score,
                    "performance": review.performance_score,
                    "security": review.security_score,
                    "overall": review.overall_score
                },
                "issues": issue_list,
                "improved_code": review.improved_code,
                "mentor_explanation": review.mentor_explanation,
                "follow_up_questions": follow_up_questions
            }
            
        except Exception as e:
            raise e
    
    def delete_review(self, review_id: str) -> bool:
        """Delete a review and its related data"""
        try:
            from app.models.review import Review
            
            review = self.db.query(Review).filter(Review.id == review_id).first()
            if not review:
                return False
            
            self.db.delete(review)
            self.db.commit()
            return True
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    def close(self):
        """Close database connection"""
        self.db.close()