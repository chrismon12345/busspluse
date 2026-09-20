from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.road_issue import RoadIssue
from app.models.verification import Verification
from app.config import settings
import math

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in meters between two GPS points"""
    R = 6371000  # Radius of earth in meters
    phi_1 = math.radians(lat1)
    phi_2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi_1) * math.cos(phi_2) * \
        math.sin(delta_lambda / 2.0) ** 2
        
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def find_or_create_road_issue(db: Session, detection):
    # Find active issues of same type
    candidate_issues = db.query(RoadIssue).filter(
        RoadIssue.issue_type == detection.issue_type,
        RoadIssue.status.notin_(["RESOLVED", "REJECTED"])
    ).all()
    
    matched_issue = None
    min_dist = settings.ISSUE_CLUSTER_RADIUS_METERS
    
    for issue in candidate_issues:
        dist = haversine_distance(
            detection.latitude, detection.longitude,
            issue.latitude, issue.longitude
        )
        if dist < min_dist:
            min_dist = dist
            matched_issue = issue
            
    if matched_issue:
        # Create verification for existing issue
        verification = Verification(
            road_issue_id=matched_issue.id,
            bus_id=detection.bus_id,
            detection_id=detection.id,
            confidence=detection.confidence
        )
        db.add(verification)
        
        # Update matched issue
        matched_issue.verification_count += 1
        matched_issue.last_detected_at = detection.timestamp
        # Simple rolling average for confidence
        matched_issue.confidence = ((matched_issue.confidence * (matched_issue.verification_count - 1)) + detection.confidence) / matched_issue.verification_count
        
        db.commit()
        
        # Cross-bus verification check
        unique_buses = db.query(Verification.bus_id).filter(
            Verification.road_issue_id == matched_issue.id
        ).distinct().count()
        
        if unique_buses == 2 and matched_issue.status == "NEW":
            matched_issue.status = "UNDER_REVIEW"
            if matched_issue.description:
                matched_issue.description += "\n[System] Upgraded to UNDER_REVIEW due to cross-bus verification (2 buses)."
            else:
                matched_issue.description = "[System] Upgraded to UNDER_REVIEW due to cross-bus verification (2 buses)."
        elif unique_buses >= 3 and matched_issue.status in ["NEW", "UNDER_REVIEW"]:
            matched_issue.status = "VERIFIED"
            if matched_issue.description:
                matched_issue.description += "\n[System] Auto-verified due to cross-bus verification (3+ buses)."
            else:
                matched_issue.description = "[System] Auto-verified due to cross-bus verification (3+ buses)."
                
        db.commit()
        db.refresh(matched_issue)
        return matched_issue
        
    else:
        # Create new issue
        new_issue = RoadIssue(
            issue_type=detection.issue_type,
            latitude=detection.latitude,
            longitude=detection.longitude,
            severity=detection.severity,
            confidence=detection.confidence,
            first_detected_at=detection.timestamp,
            last_detected_at=detection.timestamp,
            status="NEW"
        )
        db.add(new_issue)
        db.commit()
        db.refresh(new_issue)
        
        verification = Verification(
            road_issue_id=new_issue.id,
            bus_id=detection.bus_id,
            detection_id=detection.id,
            confidence=detection.confidence
        )
        db.add(verification)
        db.commit()
        
        return new_issue
