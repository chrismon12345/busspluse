from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class VerificationDetail(BaseModel):
    id: int
    bus_id: int
    detection_id: int
    confidence: float
    verified_at: datetime
    
    class Config:
        from_attributes = True

class IssueBase(BaseModel):
    issue_type: str
    latitude: float
    longitude: float
    severity: str
    confidence: float
    status: str
    description: Optional[str] = None

class IssueResponse(IssueBase):
    id: int
    verification_count: int
    first_detected_at: datetime
    last_detected_at: datetime
    created_at: datetime
    updated_at: datetime
    verification_details: Optional[List[VerificationDetail]] = []
    
    class Config:
        from_attributes = True

class IssueListResponse(BaseModel):
    items: List[IssueResponse]
    total: int

class IssueStatusUpdate(BaseModel):
    status: str
    description: Optional[str] = None

class DashboardStats(BaseModel):
    total_issues: int
    critical_issues: int
    under_repair: int
    resolved: int
    active_buses: int
    verified_issues: int

class HeatmapPoint(BaseModel):
    latitude: float
    longitude: float
    intensity: float
    issue_type: str
