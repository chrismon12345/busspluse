from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    road_issue_id = Column(Integer, ForeignKey("road_issues.id"))
    bus_id = Column(Integer, ForeignKey("buses.id"))
    detection_id = Column(Integer, ForeignKey("detections.id"))
    confidence = Column(Float)
    verified_at = Column(DateTime, default=datetime.utcnow)

    road_issue = relationship("RoadIssue", back_populates="verifications")
    bus = relationship("Bus", back_populates="verifications")
    detection = relationship("Detection", back_populates="verification")
