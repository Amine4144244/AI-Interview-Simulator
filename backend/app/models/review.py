from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    code = Column(Text, nullable=False)
    language = Column(String(50), nullable=False)
    skill_level = Column(String(20), nullable=False)
    focus = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Scores (0-100)
    correctness_score = Column(Integer, default=0)
    readability_score = Column(Integer, default=0)
    maintainability_score = Column(Integer, default=0)
    performance_score = Column(Integer, default=0)
    security_score = Column(Integer, default=0)
    overall_score = Column(Integer, default=0)
    
    # Review content
    improved_code = Column(Text)
    mentor_explanation = Column(Text)
    
    # Relationships
    issues = relationship("Issue", back_populates="review", cascade="all, delete-orphan")
    follow_up_questions = relationship("FollowUpQuestion", back_populates="review", cascade="all, delete-orphan")

class Issue(Base):
    __tablename__ = "issues"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    review_id = Column(String, ForeignKey("reviews.id"), nullable=False)
    line = Column(Integer)
    severity = Column(String(10), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    issue_type = Column(String(50), nullable=False)  # performance, security, correctness, readability, maintainability
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    suggestion = Column(Text, nullable=False)
    
    # Relationships
    review = relationship("Review", back_populates="issues")

class FollowUpQuestion(Base):
    __tablename__ = "follow_up_questions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    review_id = Column(String, ForeignKey("reviews.id"), nullable=False)
    question = Column(Text, nullable=False)
    
    # Relationships
    review = relationship("Review", back_populates="follow_up_questions")