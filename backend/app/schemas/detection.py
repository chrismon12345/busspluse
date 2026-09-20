from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DetectionBase(BaseModel):
    issue_type: str
    confidence: float
    latitude: float
    longitude: float
    severity: str
    timestamp: datetime
    image_url: Optional[str] = None
    video_timestamp: Optional[float] = None

class DetectionCreate(DetectionBase):
    bus_id: int

class DetectionResponse(DetectionBase):
    id: int
    bus_id: int
    status: str
    created_at: datetime
    bus_number: Optional[str] = None
    
    class Config:
        from_attributes = True

class DetectionListResponse(BaseModel):
    items: List[DetectionResponse]
    total: int
