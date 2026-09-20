from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Bus(Base):
    __tablename__ = "buses"

    id = Column(Integer, primary_key=True, index=True)
    bus_number = Column(String(20), unique=True, index=True)
    registration_number = Column(String(20))
    route_name = Column(String(100))
    operator = Column(String(100))
    status = Column(String(20), default="ACTIVE")
    camera_status = Column(String(20), default="ONLINE")
    last_latitude = Column(Float, nullable=True)
    last_longitude = Column(Float, nullable=True)
    last_seen = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    detections = relationship("Detection", back_populates="bus")
    verifications = relationship("Verification", back_populates="bus")
