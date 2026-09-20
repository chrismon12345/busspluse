export interface User { id: number; name: string; email: string; role: 'ADMIN' | 'AUTHORITY' | 'OPERATOR'; }
export interface Bus { id: number; bus_number: string; registration_number: string; route_name: string; operator: string; status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'; camera_status: 'ONLINE' | 'OFFLINE' | 'ERROR'; last_latitude: number | null; last_longitude: number | null; last_seen: string | null; created_at: string; }
export interface Detection { id: number; bus_id: number; bus_number?: string; issue_type: IssueType; confidence: number; latitude: number; longitude: number; timestamp: string; image_url: string | null; video_timestamp: number | null; severity: Severity; status: string; created_at: string; }
export interface RoadIssue { id: number; issue_type: IssueType; latitude: number; longitude: number; severity: Severity; confidence: number; verification_count: number; first_detected_at: string; last_detected_at: string; status: IssueStatus; description: string | null; created_at: string; updated_at: string; verifications?: Verification[]; }
export interface Verification { id: number; road_issue_id: number; bus_id: number; detection_id: number; confidence: number; verified_at: string; }
export type IssueType = 'POTHOLE' | 'ZEBRA_CROSSING_DAMAGE' | 'TRAFFIC_SIGNAL_DAMAGE' | 'ROAD_SIGN_OR_MARKING_DAMAGE' | 'BROKEN_STREETLIGHT' | 'WATERLOGGING' | 'ROAD_OBSTACLE';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueStatus = 'NEW' | 'UNDER_REVIEW' | 'VERIFIED' | 'REPORTED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export interface DashboardStats { total_issues: number; critical_issues: number; under_repair: number; resolved: number; active_buses: number; verified_issues: number; }
export interface HeatmapPoint { latitude: number; longitude: number; intensity: number; issue_type: IssueType; }
export interface AnalyticsData { issues_over_time: {date: string; count: number}[]; severity_distribution: {severity: string; count: number}[]; route_stats: {route: string; count: number}[]; }
