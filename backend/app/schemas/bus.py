from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BusBase(BaseModel):
    bus_number: str
    registration_number: str
    route_name: str
    operator: str
    status: str = "ACTIVE"
    camera_status: str = "ONLINE"
    
class BusCreate(BusBase):
    pass

class BusUpdate(BaseModel):
    status: Optional[str] = None
    camera_status: Optional[str] = None
    last_latitude: Optional[float] = None
    last_longitude: Optional[float] = None
    route_name: Optional[str] = None

class BusResponse(BusBase):
    id: int
    last_latitude: Optional[float]
    last_longitude: Optional[float]
    last_seen: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class BusListResponse(BaseModel):
    items: List[BusResponse]
    total: int
