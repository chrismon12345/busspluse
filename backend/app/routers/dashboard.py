from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.models.road_issue import RoadIssue
from app.models.bus import Bus
from app.models.detection import Detection
from app.schemas.issue import DashboardStats, HeatmapPoint

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db)
):
    total_issues = db.query(RoadIssue).count()
    critical_issues = db.query(RoadIssue).filter(RoadIssue.severity == "CRITICAL").count()
    under_repair = db.query(RoadIssue).filter(RoadIssue.status == "IN_PROGRESS").count()
    resolved = db.query(RoadIssue).filter(RoadIssue.status == "RESOLVED").count()
    active_buses = db.query(Bus).filter(Bus.status == "ACTIVE").count()
    verified_issues = db.query(RoadIssue).filter(RoadIssue.status == "VERIFIED").count()
    
    return {
        "total_issues": total_issues,
        "critical_issues": critical_issues,
        "under_repair": under_repair,
        "resolved": resolved,
        "active_buses": active_buses,
        "verified_issues": verified_issues
    }

@router.get("/heatmap")
def get_heatmap_data(
    db: Session = Depends(get_db)
):
    issues = db.query(RoadIssue).filter(
        RoadIssue.status.notin_(["RESOLVED", "REJECTED"])
    ).all()
    
    points = []
    for issue in issues:
        intensity = 1.0
        if issue.severity == "LOW": intensity = 0.3
        elif issue.severity == "MEDIUM": intensity = 0.6
        elif issue.severity == "HIGH": intensity = 0.8
        
        points.append({
            "latitude": issue.latitude,
            "longitude": issue.longitude,
            "intensity": intensity,
            "issue_type": issue.issue_type
        })
        
    return points

@router.get("/recent")
def get_recent_issues(
    limit: int = 5,
    db: Session = Depends(get_db)
):
    issues = db.query(RoadIssue).order_by(RoadIssue.last_detected_at.desc()).limit(limit).all()
    return issues

@router.get("/activity")
def get_recent_activity(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    detections = db.query(Detection).order_by(Detection.timestamp.desc()).limit(limit).all()
    activities = []
    for d in detections:
        activities.append({
            "type": "DETECTION",
            "title": f"New {d.issue_type.replace('_', ' ').title()} detected",
            "timestamp": d.timestamp,
            "bus_id": d.bus_id
        })
    return activities
