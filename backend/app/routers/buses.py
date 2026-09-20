from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database.database import get_db
from app.models.bus import Bus
from app.models.detection import Detection
from app.schemas.bus import BusListResponse, BusResponse
from app.schemas.detection import DetectionResponse

router = APIRouter(prefix="/api/buses", tags=["buses"])

@router.get("", response_model=BusListResponse)
def list_buses(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Bus)
    if status:
        query = query.filter(Bus.status == status)
        
    total = query.count()
    buses = query.offset(skip).limit(limit).all()
    
    return {"items": buses, "total": total}

@router.get("/{bus_id}", response_model=dict)
def get_bus_details(
    bus_id: int, 
    db: Session = Depends(get_db)
):
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
        
    recent_detections = db.query(Detection).filter(
        Detection.bus_id == bus_id
    ).order_by(Detection.timestamp.desc()).limit(10).all()
    
    # Add bus number to detections
    detections_with_bus = []
    for d in recent_detections:
        d_dict = d.__dict__.copy()
        d_dict['bus_number'] = bus.bus_number
        detections_with_bus.append(d_dict)
    
    return {
        "bus": bus,
        "recent_detections": detections_with_bus
    }
