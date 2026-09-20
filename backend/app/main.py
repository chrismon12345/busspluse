from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import init_db
from app.config import settings
from app.routers import auth, buses, detections, issues, analytics, dashboard

app = FastAPI(
    title="BusPlus API",
    description="AI-Powered Road Infrastructure Monitoring Platform",
    version="1.0.0",
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(buses.router)
app.include_router(detections.router)
app.include_router(issues.router)
app.include_router(analytics.router)
app.include_router(dashboard.router)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {
        "message": "BusPlus API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.post("/api/video/process")
async def process_video(file: UploadFile = File(...)):
    # Placeholder for video processing logic
    # In a real system, this would save the file and send a task to the AI worker
    return {"message": f"Received video {file.filename} for processing"}
