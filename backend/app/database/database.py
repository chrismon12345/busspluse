import random
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from app.database.models import User, Bus, RoadIssue, Detection, Verification
    from app.utils.security import hash_password
    
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if admin exists
    admin = db.query(User).filter(User.email == "admin@busplus.com").first()
    if not admin:
        admin = User(
            name="Admin",
            email="admin@busplus.com",
            password_hash=hash_password("admin123"),
            role="ADMIN"
        )
        db.add(admin)
        db.commit()

    # Check if buses exist
    if db.query(Bus).count() == 0:
        buses_data = [
            {"bus_number": "KL-01-AB-1234", "registration_number": "KL01AB1234", "route_name": "Route 1 - City Center", "operator": "KSRTC", "status": "ACTIVE", "last_latitude": 9.9816, "last_longitude": 76.2999},
            {"bus_number": "KL-01-CD-5678", "registration_number": "KL01CD5678", "route_name": "Route 2 - Airport Road", "operator": "KSRTC", "status": "ACTIVE", "last_latitude": 10.1518, "last_longitude": 76.3930},
            {"bus_number": "KL-07-EF-9012", "registration_number": "KL07EF9012", "route_name": "Route 3 - University Loop", "operator": "Private", "status": "ACTIVE", "last_latitude": 10.0270, "last_longitude": 76.3080},
            {"bus_number": "KL-07-GH-3456", "registration_number": "KL07GH3456", "route_name": "Route 4 - Tech Park", "operator": "Private", "status": "INACTIVE", "last_latitude": 10.0088, "last_longitude": 76.3570},
            {"bus_number": "KL-07-IJ-7890", "registration_number": "KL07IJ7890", "route_name": "Route 5 - MG Road", "operator": "KSRTC", "status": "ACTIVE", "last_latitude": 9.9750, "last_longitude": 76.2800},
            {"bus_number": "KL-15-KL-1234", "registration_number": "KL15KL1234", "route_name": "Route 6 - Vyttila", "operator": "Private", "status": "MAINTENANCE", "last_latitude": 9.9670, "last_longitude": 76.3180},
            {"bus_number": "KL-15-MN-5678", "registration_number": "KL15MN5678", "route_name": "Route 7 - Edappally", "operator": "Private", "status": "ACTIVE", "last_latitude": 10.0240, "last_longitude": 76.3080},
            {"bus_number": "KL-01-OP-9012", "registration_number": "KL01OP9012", "route_name": "Route 8 - Fort Kochi", "operator": "KSRTC", "status": "ACTIVE", "last_latitude": 9.9640, "last_longitude": 76.2430},
        ]
        
        for b in buses_data:
            bus = Bus(**b, camera_status="ONLINE")
            db.add(bus)
        db.commit()
        
    if settings.MOCK_AI and db.query(RoadIssue).count() == 0:
        buses = db.query(Bus).all()
        issue_types = ["POTHOLE", "ZEBRA_CROSSING_DAMAGE", "TRAFFIC_SIGNAL_DAMAGE", "ROAD_SIGN_OR_MARKING_DAMAGE", "BROKEN_STREETLIGHT", "WATERLOGGING", "ROAD_OBSTACLE"]
        severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        statuses = ["NEW", "UNDER_REVIEW", "VERIFIED", "REPORTED", "IN_PROGRESS", "RESOLVED", "REJECTED"]
        
        # Create 15 road issues
        issues = []
        for i in range(15):
            lat = 9.95 + random.uniform(0, 0.2)
            lng = 76.25 + random.uniform(0, 0.2)
            issue = RoadIssue(
                issue_type=random.choice(issue_types),
                latitude=lat,
                longitude=lng,
                severity=random.choice(severities),
                confidence=random.uniform(0.6, 0.99),
                verification_count=random.randint(1, 5),
                first_detected_at=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(5, 30)),
                last_detected_at=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 4)),
                status=random.choice(statuses),
                description=f"Mocked {issue_types[i % len(issue_types)]} detected"
            )
            db.add(issue)
            issues.append(issue)
            
        db.commit()
        
        # Create 30 detections and verifications
        for i in range(30):
            bus = random.choice(buses)
            issue = random.choice(issues)
            det = Detection(
                bus_id=bus.id,
                issue_type=issue.issue_type,
                confidence=random.uniform(0.6, 0.99),
                latitude=issue.latitude + random.uniform(-0.0001, 0.0001),
                longitude=issue.longitude + random.uniform(-0.0001, 0.0001),
                timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 30)),
                severity=issue.severity,
                status="PROCESSED"
            )
            db.add(det)
            db.commit()
            
            ver = Verification(
                road_issue_id=issue.id,
                bus_id=bus.id,
                detection_id=det.id,
                confidence=det.confidence
            )
            db.add(ver)
        db.commit()
    db.close()
