import logging
from typing import Dict, Any
from .config import CONFIDENCE_THRESHOLD, CLASS_MAP, NEEDS_VERIFICATION_CLASSES

logger = logging.getLogger(__name__)

class RoadDetector:
    """Road infrastructure and damage detector using YOLO."""

    def __init__(self, model_path: str = None):
        """
        Initialize the RoadDetector.
        
        Args:
            model_path (str, optional): Path to the YOLO model file.
        """
        self.model_path = model_path
        self.model = None
        
        if self.model_path:
            try:
                from ultralytics import YOLO
                self.model = YOLO(self.model_path)
                logger.info(f"Model loaded successfully from {self.model_path}")
            except ImportError:
                logger.error("ultralytics package not found. Model cannot be loaded.")
            except Exception as e:
                logger.warning(f"Failed to load model from {self.model_path}: {e}")
                self.model = None
        else:
            logger.warning("No model_path provided. Detector will return empty detections.")

    def detect_frame(self, frame) -> Dict[str, Any]:
        """
        Run detection on a single frame.

        Args:
            frame: OpenCV image array.

        Returns:
            Dict containing detections and model_loaded status.
        """
        if self.model is None:
            return {'detections': [], 'model_loaded': False}

        try:
            results = self.model(frame, verbose=False)
            detections = []
            
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    confidence = float(box.conf[0])
                    if confidence >= CONFIDENCE_THRESHOLD:
                        class_id = int(box.cls[0])
                        class_name = CLASS_MAP.get(class_id, "unknown")
                        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                        
                        det_info = {
                            'class': class_name,
                            'confidence': confidence,
                            'bbox': [x1, y1, x2, y2],
                            'class_id': class_id
                        }
                        
                        if class_name in NEEDS_VERIFICATION_CLASSES:
                            det_info['verification_status'] = 'NEEDS_VERIFICATION'
                            det_info['verification_note'] = f"Visual detection alone cannot confirm if {class_name} is malfunctioning."
                            
                        detections.append(det_info)
                        
            return {'detections': detections, 'model_loaded': True}
            
        except Exception as e:
            logger.error(f"Error during inference: {e}")
            return {'detections': [], 'model_loaded': True}
