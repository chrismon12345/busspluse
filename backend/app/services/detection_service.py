from sqlalchemy.orm import Session
from app.models.detection import Detection
from app.schemas.detection import DetectionCreate
from app.services.verification_service import find_or_create_road_issue

def process_detection(db: Session, detection_data: DetectionCreate):
    # 1. Save raw detection
    detection = Detection(
        bus_id=detection_data.bus_id,
        issue_type=detection_data.issue_type,
        confidence=detection_data.confidence,
        latitude=detection_data.latitude,
        longitude=detection_data.longitude,
        timestamp=detection_data.timestamp,
        image_url=detection_data.image_url,
        video_timestamp=detection_data.video_timestamp,
        severity=detection_data.severity,
        status="PROCESSED"
    )
    db.add(detection)
    db.commit()
    db.refresh(detection)
    
    # 2. Call verification service to cluster and update road issues
    road_issue = find_or_create_road_issue(db, detection)
    
    return detection, road_issue
