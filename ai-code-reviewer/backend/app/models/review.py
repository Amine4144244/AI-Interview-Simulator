from sqlalchemy import Column, String, Text, DateTime, JSON
from datetime import datetime
from app.models.database import Base
import uuid

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(Text, nullable=False)
    language = Column(String, nullable=False)
    skill_level = Column(String, nullable=False)
    focus_areas = Column(JSON, nullable=False)
    issues = Column(JSON, nullable=False)
    improved_code = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    scores = Column(JSON, nullable=False)
    follow_up_questions = Column(JSON, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_ip = Column(String, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "language": self.language,
            "skill_level": self.skill_level,
            "focus_areas": self.focus_areas,
            "issues": self.issues,
            "improved_code": self.improved_code,
            "explanation": self.explanation,
            "scores": self.scores,
            "follow_up_questions": self.follow_up_questions,
            "timestamp": self.timestamp.isoformat(),
        }
