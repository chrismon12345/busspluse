from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class RoadIssue(Base):
    __tablename__ = "road_issues"

    id = Column(Integer, primary_key=True, index=True)
    issue_type = Column(String(50))
    latitude = Column(Float)
    longitude = Column(Float)
    severity = Column(String(20))
    confidence = Column(Float)
    verification_count = Column(Integer, default=1)
    first_detected_at = Column(DateTime, default=datetime.utcnow)
    last_detected_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="NEW")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    verifications = relationship("Verification", back_populates="road_issue")
