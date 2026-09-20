from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
from app.database.database import get_db
from app.models.detection import Detection
from app.models.bus import Bus
from app.schemas.detection import DetectionListResponse, DetectionCreate, DetectionResponse
from app.services.detection_service import process_detection

router = APIRouter(prefix="/api/detections", tags=["detections"])

@router.get("", response_model=DetectionListResponse)
def list_detections(
    issue_type: Optional[str] = None,
    bus_id: Optional[int] = None,
    severity: Optional[str] = None,
    days: int = 30,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Detection).join(Bus)
    
    if issue_type:
        query = query.filter(Detection.issue_type == issue_type)
    if bus_id:
        query = query.filter(Detection.bus_id == bus_id)
    if severity:
        query = query.filter(Detection.severity == severity)
        
    date_limit = datetime.utcnow() - timedelta(days=days)
    query = query.filter(Detection.timestamp >= date_limit)
    
    total = query.count()
    detections = query.order_by(Detection.timestamp.desc()).offset(skip).limit(limit).all()
    
    for d in detections:
        d.bus_number = d.bus.bus_number
        
    return {"items": detections, "total": total}

@router.post("", response_model=DetectionResponse)
def create_detection(
    detection: DetectionCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # This could be called by edge devices, so we don't necessarily require standard user auth here
    # A real implementation would use an API key or device token
    bus = db.query(Bus).filter(Bus.id == detection.bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
        
    result_det, _ = process_detection(db, detection)
    result_det.bus_number = bus.bus_number
    
    return result_det
