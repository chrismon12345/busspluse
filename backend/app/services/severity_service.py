def calculate_severity(issue_type: str, confidence: float, bbox_area_ratio: float = None, detection_count: int = 1, bus_count: int = 1) -> str:
    """
    Calculate severity of a road issue based on multiple factors.
    NOTE: These are heuristic thresholds and are not scientifically validated.
    They should be tuned based on real-world data and expert feedback.
    """
    base_severity = "LOW"
    
    if issue_type == "POTHOLE":
        if bbox_area_ratio and bbox_area_ratio > 0.15:
            base_severity = "CRITICAL"
        elif bbox_area_ratio and bbox_area_ratio > 0.05:
            base_severity = "HIGH"
        else:
            base_severity = "MEDIUM"
            
    elif issue_type == "WATERLOGGING":
        if bbox_area_ratio and bbox_area_ratio > 0.3:
            base_severity = "CRITICAL"
        else:
            base_severity = "HIGH"
            
    elif issue_type == "BROKEN_STREETLIGHT":
        base_severity = "MEDIUM"
        
    elif issue_type in ["TRAFFIC_SIGNAL_DAMAGE", "ROAD_OBSTACLE"]:
        base_severity = "HIGH"
        
    elif issue_type == "ZEBRA_CROSSING_DAMAGE":
        base_severity = "MEDIUM"
        
    # Upgrade severity if verified by multiple buses
    if bus_count >= 3 and base_severity == "LOW":
        return "MEDIUM"
    if bus_count >= 5 and base_severity == "MEDIUM":
        return "HIGH"
        
    # Upgrade if very high confidence
    if confidence > 0.95 and base_severity == "LOW":
        return "MEDIUM"
        
    return base_severity
