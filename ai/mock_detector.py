import random
from typing import Dict, Any, Tuple
from .config import CLASS_MAP, NEEDS_VERIFICATION_CLASSES

class MockDetector:
    """
    Mock detector for development and demo purposes.
    Generates realistic looking mock detections instead of running a real ML model.
    """

    def __init__(self, center_lat: float = 10.0159, center_lng: float = 76.3419):
        """
        Initialize the MockDetector.
        
        Args:
            center_lat (float): Base latitude for mock GPS. Defaults to Kochi area.
            center_lng (float): Base longitude for mock GPS. Defaults to Kochi area.
        """
        self.center_lat = center_lat
        self.center_lng = center_lng

    def detect_frame(self, frame=None, frame_number: int = 0) -> Dict[str, Any]:
        """
        Generate mock detections for a frame.
        
        Args:
            frame: OpenCV image array (ignored).
            frame_number (int): Current frame number.
            
        Returns:
            Dict containing mock detections and model_loaded status.
        """
        # ~30% chance of detections in this frame
        if random.random() > 0.3:
            return {'detections': [], 'model_loaded': True}
            
        num_detections = random.randint(1, 3)
        detections = [self.generate_mock_detection() for _ in range(num_detections)]
        
        return {'detections': detections, 'model_loaded': True}

    def generate_mock_detection(self) -> Dict[str, Any]:
        """
        Generates a single realistic mock detection.
        
        Returns:
            Dict containing detection info.
        """
        class_id = random.choice(list(CLASS_MAP.keys()))
        class_name = CLASS_MAP[class_id]
        
        # Realistic confidence between 0.55 and 0.98
        confidence = round(random.uniform(0.55, 0.98), 2)
        
        # Random bbox within 1920x1080
        x1 = random.randint(0, 1500)
        y1 = random.randint(0, 800)
        x2 = random.randint(x1 + 50, min(1920, x1 + 400))
        y2 = random.randint(y1 + 50, min(1080, y1 + 400))
        
        det_info = {
            'class': class_name,
            'confidence': confidence,
            'bbox': [x1, y1, x2, y2],
            'class_id': class_id
        }
        
        if class_name in NEEDS_VERIFICATION_CLASSES:
            status = random.choice(['DETECTED', 'POSSIBLE', 'NEEDS_VERIFICATION'])
            det_info['verification_status'] = status
            det_info['verification_note'] = f"Mock visual detection note for {class_name}."
            
        return det_info

    def get_mock_gps(self) -> Tuple[float, float]:
        """
        Generate mock GPS coordinates with a small offset from center.
        
        Returns:
            Tuple of (latitude, longitude).
        """
        lat_offset = random.uniform(-0.05, 0.05)
        lng_offset = random.uniform(-0.05, 0.05)
        return (self.center_lat + lat_offset, self.center_lng + lng_offset)
