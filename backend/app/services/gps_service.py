import abc
import random
import csv
from typing import Tuple

class GPSProvider(abc.ABC):
    @abc.abstractmethod
    def get_coordinates(self, timestamp: float) -> Tuple[float, float]:
        pass

class MockGPSProvider(GPSProvider):
    def __init__(self, center_lat=9.9816, center_lng=76.2999, variance=0.05):
        self.center_lat = center_lat
        self.center_lng = center_lng
        self.variance = variance
        
    def get_coordinates(self, timestamp: float) -> Tuple[float, float]:
        lat = self.center_lat + random.uniform(-self.variance, self.variance)
        lng = self.center_lng + random.uniform(-self.variance, self.variance)
        return lat, lng

class CSVGPSProvider(GPSProvider):
    def __init__(self, csv_path: str):
        self.data = []
        try:
            with open(csv_path, 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    self.data.append({
                        'timestamp': float(row['timestamp']),
                        'lat': float(row['latitude']),
                        'lng': float(row['longitude'])
                    })
            self.data.sort(key=lambda x: x['timestamp'])
        except Exception:
            pass
            
    def get_coordinates(self, timestamp: float) -> Tuple[float, float]:
        if not self.data:
            return 0.0, 0.0
            
        # Find nearest
        nearest = min(self.data, key=lambda x: abs(x['timestamp'] - timestamp))
        return nearest['lat'], nearest['lng']

def get_gps_provider(source_type: str = "mock", **kwargs) -> GPSProvider:
    if source_type == "csv" and "csv_path" in kwargs:
        return CSVGPSProvider(kwargs["csv_path"])
    return MockGPSProvider(**kwargs)
