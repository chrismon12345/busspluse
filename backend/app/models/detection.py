from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey("buses.id"))
    issue_type = Column(String(50))
    confidence = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    image_url = Column(String(255), nullable=True)
    video_timestamp = Column(Float, nullable=True)
    severity = Column(String(20))
    status = Column(String(20), default="NEW")
    created_at = Column(DateTime, default=datetime.utcnow)

    bus = relationship("Bus", back_populates="detections")
    verification = relationship("Verification", back_populates="detection", uselist=False)
