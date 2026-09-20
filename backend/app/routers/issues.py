from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
from app.database.database import get_db
from app.models.road_issue import RoadIssue
from app.schemas.issue import IssueListResponse, IssueResponse, IssueStatusUpdate
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/issues", tags=["issues"])

@router.get("", response_model=IssueListResponse)
def list_issues(
    issue_type: Optional[str] = None,
    severity: Optional[str] = None,
    status: Optional[str] = None,
    days: int = 30,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(RoadIssue)
    
    if issue_type:
        query = query.filter(RoadIssue.issue_type == issue_type)
    if severity:
        query = query.filter(RoadIssue.severity == severity)
    if status:
        query = query.filter(RoadIssue.status == status)
        
    date_limit = datetime.utcnow() - timedelta(days=days)
    query = query.filter(RoadIssue.last_detected_at >= date_limit)
    
    total = query.count()
    issues = query.order_by(RoadIssue.last_detected_at.desc()).offset(skip).limit(limit).all()
    
    return {"items": issues, "total": total}

@router.get("/{issue_id}", response_model=IssueResponse)
def get_issue(
    issue_id: int,
    db: Session = Depends(get_db)
):
    issue = db.query(RoadIssue).filter(RoadIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    # We populate verification_details based on relationship
    issue.verification_details = issue.verifications
    return issue

@router.patch("/{issue_id}/status", response_model=IssueResponse)
def update_issue_status(
    issue_id: int,
    update: IssueStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    issue = db.query(RoadIssue).filter(RoadIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    issue.status = update.status
    if update.description is not None:
        issue.description = update.description
        
    db.commit()
    db.refresh(issue)
    
    issue.verification_details = issue.verifications
    return issue
