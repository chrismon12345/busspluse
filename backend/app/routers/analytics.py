from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database.database import get_db
from app.models.road_issue import RoadIssue
from app.models.detection import Detection
from app.models.bus import Bus

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/issues")
def get_issues_over_time(
    days: int = 30,
    db: Session = Depends(get_db)
):
    date_limit = datetime.utcnow() - timedelta(days=days)
    
    # Group by day and count
    # Note: SQLite date manipulation is different from Postgres, handling this conditionally or simply in python
    # We'll fetch and process in python for simplicity and database agnostic
    issues = db.query(RoadIssue.first_detected_at).filter(RoadIssue.first_detected_at >= date_limit).all()
    
    counts_by_date = {}
    for i in range(days + 1):
        d = (datetime.utcnow() - timedelta(days=i)).date()
        counts_by_date[d.isoformat()] = 0
        
    for issue in issues:
        d = issue.first_detected_at.date().isoformat()
        if d in counts_by_date:
            counts_by_date[d] += 1
            
    result = [{"date": k, "count": v} for k, v in sorted(counts_by_date.items())]
    return result

@router.get("/severity")
def get_severity_distribution(
    db: Session = Depends(get_db)
):
    results = db.query(RoadIssue.severity, func.count(RoadIssue.id)).group_by(RoadIssue.severity).all()
    return [{"severity": r[0], "count": r[1]} for r in results]

@router.get("/routes")
def get_issues_per_route(
    db: Session = Depends(get_db)
):
    # Get detections joined with buses, group by route
    results = db.query(Bus.route_name, func.count(Detection.id))\
        .join(Detection)\
        .group_by(Bus.route_name)\
        .order_by(func.count(Detection.id).desc())\
        .limit(10)\
        .all()
        
    return [{"route": r[0], "count": r[1]} for r in results if r[0]]
