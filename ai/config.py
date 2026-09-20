import os

# Model configuration
MODEL_PATH = os.getenv('MODEL_PATH', 'ai/models/best.pt')
MOCK_AI = os.getenv('MOCK_AI', 'true').lower() == 'true'
FRAME_SKIP = int(os.getenv('FRAME_SKIP', '5'))
CONFIDENCE_THRESHOLD = float(os.getenv('CONFIDENCE_THRESHOLD', '0.5'))
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:8000')

# Supported detection classes
CLASS_MAP = {
    0: 'pothole',
    1: 'zebra_crossing',
    2: 'traffic_signal',
    3: 'road_sign',
    4: 'road_marking',
    5: 'streetlight',
    6: 'waterlogging',
    7: 'road_obstacle'
}

# Map AI classes to issue types
CLASS_TO_ISSUE_TYPE = {
    'pothole': 'POTHOLE',
    'zebra_crossing': 'ZEBRA_CROSSING_DAMAGE',
    'traffic_signal': 'TRAFFIC_SIGNAL_DAMAGE',
    'road_sign': 'ROAD_SIGN_OR_MARKING_DAMAGE',
    'road_marking': 'ROAD_SIGN_OR_MARKING_DAMAGE',
    'streetlight': 'BROKEN_STREETLIGHT',
    'waterlogging': 'WATERLOGGING',
    'road_obstacle': 'ROAD_OBSTACLE'
}

# Categories that need special verification notes
# (cannot definitively determine malfunction from a single image)
NEEDS_VERIFICATION_CLASSES = ['traffic_signal', 'streetlight']
