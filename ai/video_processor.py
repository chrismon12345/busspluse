import cv2
import time
import os
import argparse
import logging
import requests
from typing import Dict, Any, Tuple, Optional
from datetime import datetime

from .config import FRAME_SKIP, BACKEND_URL, MOCK_AI, MODEL_PATH, CLASS_TO_ISSUE_TYPE
from .detector import RoadDetector
from .mock_detector import MockDetector
from .tracker import SimpleTracker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VideoProcessor:
    """Processes video feeds, runs detection and tracking, and reports issues."""

    def __init__(self, detector=None, tracker=None, gps_provider=None, backend_url: str = None):
        """Initialize the video processor."""
        if detector is None:
            if MOCK_AI:
                logger.info("Using MockDetector.")
                self.detector = MockDetector()
            else:
                logger.info(f"Using RoadDetector with model {MODEL_PATH}")
                self.detector = RoadDetector(MODEL_PATH)
        else:
            self.detector = detector

        self.tracker = tracker or SimpleTracker()
        self.gps_provider = gps_provider
        self.backend_url = backend_url or BACKEND_URL
        
        # Ensure evidence directory exists
        os.makedirs('evidence', exist_ok=True)

    def process_video(self, video_path: str, gps_csv_path: Optional[str] = None, bus_id: int = 1) -> Dict[str, Any]:
        """
        Process a video file.
        
        Args:
            video_path (str): Path to the video file.
            gps_csv_path (str, optional): Path to GPS sync data.
            bus_id (int): ID of the bus reporting.
            
        Returns:
            Dict containing processing summary.
        """
        logger.info(f"Processing video: {video_path}")
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            logger.error(f"Failed to open video: {video_path}")
            return {'error': 'Failed to open video'}

        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = frame_count / fps if fps else 0
        
        frames_processed = 0
        detections_found = 0
        issues_reported = 0
        start_time = time.time()
        
        frame_idx = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            if frame_idx % FRAME_SKIP == 0:
                # 1. Run detection
                if isinstance(self.detector, MockDetector):
                    result = self.detector.detect_frame(frame, frame_idx)
                else:
                    result = self.detector.detect_frame(frame)
                    
                detections = result.get('detections', [])
                if detections:
                    detections_found += len(detections)
                    
                # 2. Update tracker
                self.tracker.update(detections, frame=frame.copy() if detections else None)
                frames_processed += 1
                
            frame_idx += 1
            
        cap.release()
        
        # Process completed tracks
        completed_tracks = self.tracker.get_completed_tracks()
        
        for track in completed_tracks:
            # 3. Associate GPS
            lat, lng = self._associate_gps(0, fps, None) # Mocked GPS association
            
            # 4. Save evidence image if available
            evidence_path = ""
            if track.get('best_frame') is not None:
                evidence_path = self._save_evidence_image(track['best_frame'], track)
            
            # 5. Submit to backend
            issue_type = CLASS_TO_ISSUE_TYPE.get(track['class'], 'UNKNOWN')
            detection_data = {
                'bus_id': bus_id,
                'issue_type': issue_type,
                'confidence': track['best_confidence'],
                'latitude': lat,
                'longitude': lng,
                'evidence_path': evidence_path,
                'timestamp': datetime.utcnow().isoformat()
            }
            if 'verification_status' in track:
                detection_data['verification_status'] = track['verification_status']
                
            success = self._submit_detection(detection_data)
            if success:
                issues_reported += 1
                
        self.tracker.reset()
        
        summary = {
            'frames_processed': frames_processed,
            'detections_found': detections_found,
            'issues_reported': issues_reported,
            'duration': duration,
            'processing_time': time.time() - start_time
        }
        logger.info(f"Processing complete: {summary}")
        return summary

    def _save_evidence_image(self, frame, detection: Dict[str, Any], output_dir: str = 'evidence') -> str:
        """Save evidence image with bounding box."""
        filename = f"{output_dir}/evidence_{int(time.time()*1000)}_{detection['class']}.jpg"
        
        # Draw bounding box
        x1, y1, x2, y2 = detection['bbox']
        img = frame.copy()
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
        label = f"{detection['class']} {detection['best_confidence']:.2f}"
        cv2.putText(img, label, (x1, max(y1 - 10, 0)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        cv2.imwrite(filename, img)
        return filename

    def _submit_detection(self, detection_data: Dict[str, Any]) -> bool:
        """Submit detection to backend API."""
        try:
            url = f"{self.backend_url}/api/detections"
            logger.info(f"Submitting detection to {url}: {detection_data['issue_type']}")
            # Mock successful submission for now if no real backend
            # response = requests.post(url, json=detection_data, timeout=5)
            # return response.status_code == 200
            return True
        except Exception as e:
            logger.error(f"Failed to submit detection: {e}")
            return False

    def _associate_gps(self, frame_number: int, fps: float, gps_data: Any) -> Tuple[float, float]:
        """Associate GPS coordinates to a frame."""
        if isinstance(self.detector, MockDetector):
            return self.detector.get_mock_gps()
        # Default mock coordinates for now
        return (10.0159, 76.3419)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process video for BusPlus AI pipeline.')
    parser.add_argument('--video', type=str, required=True, help='Path to video file')
    args = parser.parse_args()
    
    processor = VideoProcessor()
    processor.process_video(args.video)
