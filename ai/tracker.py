from typing import List, Dict, Any

class SimpleTracker:
    """Simple IoU-based tracker for detections."""

    def __init__(self, iou_threshold: float = 0.3, max_age: int = 10):
        """
        Initialize the tracker.
        
        Args:
            iou_threshold (float): Minimum IoU for matching tracks.
            max_age (int): Maximum frames to keep an unmatched track alive.
        """
        self.iou_threshold = iou_threshold
        self.max_age = max_age
        self.tracks: Dict[int, Dict[str, Any]] = {}
        self.completed_tracks: List[Dict[str, Any]] = []
        self.next_id: int = 0

    def _calculate_iou(self, box1: List[int], box2: List[int]) -> float:
        """Calculate Intersection over Union (IoU) of two bounding boxes."""
        x1_1, y1_1, x2_1, y2_1 = box1
        x1_2, y1_2, x2_2, y2_2 = box2

        xi1 = max(x1_1, x1_2)
        yi1 = max(y1_1, y1_2)
        xi2 = min(x2_1, x2_2)
        yi2 = min(y2_1, y2_2)

        inter_area = max(0, xi2 - xi1) * max(0, yi2 - yi1)

        box1_area = (x2_1 - x1_1) * (y2_1 - y1_1)
        box2_area = (x2_2 - x1_2) * (y2_2 - y1_2)
        union_area = box1_area + box2_area - inter_area

        if union_area == 0:
            return 0.0

        return inter_area / union_area

    def update(self, detections: List[Dict[str, Any]], frame: Any = None) -> List[Dict[str, Any]]:
        """
        Update tracks with current frame detections.
        
        Args:
            detections (List[Dict]): List of detection dictionaries.
            frame: Optional frame for context.
            
        Returns:
            List[Dict]: List of active tracks with their info.
        """
        # Increment age for all existing tracks
        for track_id in self.tracks:
            self.tracks[track_id]['age'] += 1

        matched_track_ids = set()
        matched_detection_indices = set()

        # Try to match detections to tracks
        for d_idx, det in enumerate(detections):
            best_iou = 0
            best_track_id = -1
            
            for track_id, track in self.tracks.items():
                if track_id in matched_track_ids or track['class'] != det['class']:
                    continue
                    
                iou = self._calculate_iou(det['bbox'], track['bbox'])
                if iou > best_iou and iou >= self.iou_threshold:
                    best_iou = iou
                    best_track_id = track_id
            
            if best_track_id != -1:
                # Match found, update track
                self.tracks[best_track_id]['bbox'] = det['bbox']
                self.tracks[best_track_id]['age'] = 0
                if det['confidence'] > self.tracks[best_track_id]['best_confidence']:
                    self.tracks[best_track_id]['best_confidence'] = det['confidence']
                    self.tracks[best_track_id]['best_frame'] = frame
                matched_track_ids.add(best_track_id)
                matched_detection_indices.add(d_idx)

        # Create new tracks for unmatched detections
        for d_idx, det in enumerate(detections):
            if d_idx not in matched_detection_indices:
                self.tracks[self.next_id] = {
                    'track_id': self.next_id,
                    'bbox': det['bbox'],
                    'class': det['class'],
                    'class_id': det['class_id'],
                    'confidence': det['confidence'],
                    'age': 0,
                    'best_confidence': det['confidence'],
                    'best_frame': frame
                }
                # Include verification info if present
                if 'verification_status' in det:
                    self.tracks[self.next_id]['verification_status'] = det['verification_status']
                    self.tracks[self.next_id]['verification_note'] = det.get('verification_note', '')
                self.next_id += 1

        # Remove tracks older than max_age
        active_tracks = {}
        for track_id, track in self.tracks.items():
            if track['age'] <= self.max_age:
                active_tracks[track_id] = track
            else:
                self.completed_tracks.append(track)
                
        self.tracks = active_tracks
        return list(self.tracks.values())

    def get_completed_tracks(self) -> List[Dict[str, Any]]:
        """Return tracks that have been completed/aged out."""
        # Also return active tracks as completed when requested
        all_completed = self.completed_tracks + list(self.tracks.values())
        return all_completed

    def reset(self):
        """Clear all tracks."""
        self.tracks = {}
        self.completed_tracks = []
        self.next_id = 0
