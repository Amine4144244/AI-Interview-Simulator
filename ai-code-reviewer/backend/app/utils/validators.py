from pydantic import BaseModel, Field, validator
from typing import List

class ReviewRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=50000)
    language: str = Field(..., pattern="^(javascript|typescript|python|java|go|rust)$")
    skill_level: str = Field(..., pattern="^(junior|mid|senior)$")
    focus_areas: List[str] = Field(..., min_items=1)
    
    @validator('focus_areas')
    def validate_focus_areas(cls, v):
        valid_areas = {'bugs', 'performance', 'clean_code', 'security'}
        for area in v:
            if area not in valid_areas:
                raise ValueError(f"Invalid focus area: {area}")
        return v

class ReviewIssue(BaseModel):
    line: int
    severity: str
    title: str
    description: str
    risk: str
    suggestion: str

class ReviewScores(BaseModel):
    correctness: int = Field(..., ge=0, le=100)
    readability: int = Field(..., ge=0, le=100)
    maintainability: int = Field(..., ge=0, le=100)
    performance: int = Field(..., ge=0, le=100)
    security: int = Field(..., ge=0, le=100)
    overall: int = Field(..., ge=0, le=100)

class ReviewResponse(BaseModel):
    id: str
    code: str
    language: str
    skill_level: str
    focus_areas: List[str]
    issues: List[ReviewIssue]
    improved_code: str
    explanation: str
    scores: ReviewScores
    follow_up_questions: List[str]
    timestamp: str
