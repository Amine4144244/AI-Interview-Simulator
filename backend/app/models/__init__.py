from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Request Models
class ReviewRequest(BaseModel):
    code: str = Field(..., description="The code to be reviewed", min_length=1)
    language: str = Field(..., description="Programming language", regex="^(javascript|python|typescript|java)$")
    skill_level: str = Field(..., description="Developer skill level", regex="^(junior|mid|senior)$")
    focus: str = Field(..., description="Review focus area", regex="^(bugs|performance|clean_code|security|all)$")

# Issue Model for response
class Issue(BaseModel):
    line: Optional[int] = None
    severity: str = Field(..., description="Issue severity: LOW, MEDIUM, HIGH, CRITICAL")
    type: str = Field(..., description="Issue type: performance, security, correctness, readability, maintainability")
    title: str = Field(..., description="Short title describing the issue")
    description: str = Field(..., description="Detailed description of the issue")
    explanation: str = Field(..., description="Why this issue matters")
    suggestion: str = Field(..., description="How to fix the issue")

# Score Model
class Score(BaseModel):
    correctness: int = Field(..., ge=0, le=100, description="Code correctness score (0-100)")
    readability: int = Field(..., ge=0, le=100, description="Code readability score (0-100)")
    maintainability: int = Field(..., ge=0, le=100, description="Code maintainability score (0-100)")
    performance: int = Field(..., ge=0, le=100, description="Code performance score (0-100)")
    security: int = Field(..., ge=0, le=100, description="Code security score (0-100)")
    overall: int = Field(..., ge=0, le=100, description="Overall code score (0-100)")

# Response Model
class ReviewResponse(BaseModel):
    review_id: str = Field(..., description="Unique review identifier")
    code: str = Field(..., description="Original code submitted")
    language: str = Field(..., description="Programming language")
    skill_level: str = Field(..., description="Developer skill level")
    focus: str = Field(..., description="Review focus area")
    timestamp: datetime = Field(..., description="Review timestamp")
    score: Score = Field(..., description="Score breakdown")
    issues: List[Issue] = Field(default_factory=list, description="List of issues found")
    improved_code: str = Field(..., description="Improved version of the code")
    mentor_explanation: str = Field(..., description="Holistic mentor explanation")
    follow_up_questions: List[str] = Field(default_factory=list, description="Follow-up learning questions")

# History models
class ReviewHistoryItem(BaseModel):
    review_id: str
    language: str
    skill_level: str
    focus: str
    timestamp: datetime
    overall_score: int
    issue_count: int

class ReviewHistoryResponse(BaseModel):
    reviews: List[ReviewHistoryItem]
    total: int