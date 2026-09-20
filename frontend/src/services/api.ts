import axios from 'axios';
import type { Bus, Detection, RoadIssue, DashboardStats, HeatmapPoint } from '../types';

const baseURL = import.meta.env.VITE_API_URL
  ? `${(import.meta.env.VITE_API_URL as string).replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Fallback mock data (used when backend is unavailable) ----

const MOCK_BUSES: Bus[] = [
  { id: 1, bus_number: 'KL-01-AB-1234', registration_number: 'KL-01-AB-1234', route_name: 'Route 1 - City Center', operator: 'KSRTC', status: 'ACTIVE', camera_status: 'ONLINE', last_latitude: 10.0159, last_longitude: 76.3419, last_seen: new Date().toISOString(), created_at: '2024-01-01T00:00:00' },
  { id: 2, bus_number: 'KL-01-CD-5678', registration_number: 'KL-01-CD-5678', route_name: 'Route 2 - Airport Road', operator: 'KSRTC', status: 'ACTIVE', camera_status: 'ONLINE', last_latitude: 10.0255, last_longitude: 76.3085, last_seen: new Date().toISOString(), created_at: '2024-01-01T00:00:00' },
  { id: 3, bus_number: 'KL-01-EF-9012', registration_number: 'KL-01-EF-9012', route_name: 'Route 3 - University Loop', operator: 'KURTC', status: 'ACTIVE', camera_status: 'ONLINE', last_latitude: 10.0450, last_longitude: 76.3280, last_seen: new Date().toISOString(), created_at: '2024-01-01T00:00:00' },
  { id: 4, bus_number: 'KL-01-GH-3456', registration_number: 'KL-01-GH-3456', route_name: 'Route 4 - Marine Drive', operator: 'Private', status: 'ACTIVE', camera_status: 'ONLINE', last_latitude: 9.9816, last_longitude: 76.2999, last_seen: new Date().toISOString(), created_at: '2024-01-01T00:00:00' },
  { id: 5, bus_number: 'KL-01-IJ-7890', registration_number: 'KL-01-IJ-7890', route_name: 'Route 5 - Technopark', operator: 'KSRTC', status: 'ACTIVE', camera_status: 'ERROR', last_latitude: 10.0610, last_longitude: 76.3520, last_seen: new Date(Date.now() - 3600000).toISOString(), created_at: '2024-01-01T00:00:00' },
  { id: 6, bus_number: 'KL-01-KL-2345', registration_number: 'KL-01-KL-2345', route_name: 'Route 6 - Hill Palace', operator: 'KURTC', status: 'INACTIVE', camera_status: 'OFFLINE', last_latitude: 10.0480, last_longitude: 76.3130, last_seen: new Date(Date.now() - 86400000).toISOString(), created_at: '2024-01-01T00:00:00' },
  { id: 7, bus_number: 'KL-01-MN-6789', registration_number: 'KL-01-MN-6789', route_name: 'Route 7 - Fort Kochi', operator: 'Private', status: 'ACTIVE', camera_status: 'ONLINE', last_latitude: 9.9658, last_longitude: 76.2427, last_seen: new Date().toISOString(), created_at: '2024-01-01T00:00:00' },
  { id: 8, bus_number: 'KL-01-OP-0123', registration_number: 'KL-01-OP-0123', route_name: 'Route 8 - Edappally Junction', operator: 'KSRTC', status: 'MAINTENANCE', camera_status: 'OFFLINE', last_latitude: 10.0261, last_longitude: 76.3125, last_seen: new Date(Date.now() - 172800000).toISOString(), created_at: '2024-01-01T00:00:00' },
];

function daysAgo(n: number) { return new Date(Date.now() - n * 86400000).toISOString(); }

const MOCK_ISSUES: RoadIssue[] = [
  { id: 1, issue_type: 'POTHOLE', latitude: 10.0159, longitude: 76.3419, severity: 'HIGH', confidence: 0.95, verification_count: 5, first_detected_at: daysAgo(12), last_detected_at: daysAgo(1), status: 'VERIFIED', description: 'Large pothole near MG Road junction', created_at: daysAgo(12), updated_at: daysAgo(1) },
  { id: 2, issue_type: 'BROKEN_STREETLIGHT', latitude: 10.0255, longitude: 76.3085, severity: 'MEDIUM', confidence: 0.78, verification_count: 2, first_detected_at: daysAgo(8), last_detected_at: daysAgo(3), status: 'UNDER_REVIEW', description: 'Streetlight not functioning near bus stop. Visual detection cannot definitively confirm malfunction — verification required.', created_at: daysAgo(8), updated_at: daysAgo(3) },
  { id: 3, issue_type: 'WATERLOGGING', latitude: 10.0450, longitude: 76.3280, severity: 'CRITICAL', confidence: 0.92, verification_count: 7, first_detected_at: daysAgo(5), last_detected_at: daysAgo(0), status: 'VERIFIED', description: 'Severe waterlogging on University Road after monsoon', created_at: daysAgo(5), updated_at: daysAgo(0) },
  { id: 4, issue_type: 'ROAD_OBSTACLE', latitude: 9.9816, longitude: 76.2999, severity: 'HIGH', confidence: 0.88, verification_count: 3, first_detected_at: daysAgo(2), last_detected_at: daysAgo(0), status: 'REPORTED', description: 'Fallen tree branch blocking lane on Marine Drive', created_at: daysAgo(2), updated_at: daysAgo(0) },
  { id: 5, issue_type: 'ZEBRA_CROSSING_DAMAGE', latitude: 10.0610, longitude: 76.3520, severity: 'MEDIUM', confidence: 0.82, verification_count: 4, first_detected_at: daysAgo(20), last_detected_at: daysAgo(6), status: 'IN_PROGRESS', description: 'Faded zebra crossing near school zone', created_at: daysAgo(20), updated_at: daysAgo(6) },
  { id: 6, issue_type: 'TRAFFIC_SIGNAL_DAMAGE', latitude: 10.0480, longitude: 76.3130, severity: 'CRITICAL', confidence: 0.71, verification_count: 1, first_detected_at: daysAgo(1), last_detected_at: daysAgo(1), status: 'NEW', description: 'Possible traffic signal malfunction at Edappally junction. Visual detection cannot definitively confirm — needs field verification.', created_at: daysAgo(1), updated_at: daysAgo(1) },
  { id: 7, issue_type: 'ROAD_SIGN_OR_MARKING_DAMAGE', latitude: 9.9658, longitude: 76.2427, severity: 'LOW', confidence: 0.85, verification_count: 2, first_detected_at: daysAgo(15), last_detected_at: daysAgo(10), status: 'RESOLVED', description: 'Faded speed limit sign on Fort Kochi road', created_at: daysAgo(15), updated_at: daysAgo(3) },
  { id: 8, issue_type: 'POTHOLE', latitude: 10.0261, longitude: 76.3125, severity: 'MEDIUM', confidence: 0.89, verification_count: 3, first_detected_at: daysAgo(7), last_detected_at: daysAgo(2), status: 'VERIFIED', description: 'Medium pothole on NH66 near toll booth', created_at: daysAgo(7), updated_at: daysAgo(2) },
  { id: 9, issue_type: 'POTHOLE', latitude: 10.0350, longitude: 76.3380, severity: 'CRITICAL', confidence: 0.97, verification_count: 8, first_detected_at: daysAgo(18), last_detected_at: daysAgo(0), status: 'IN_PROGRESS', description: 'Deep pothole causing vehicle damage — multiple complaints', created_at: daysAgo(18), updated_at: daysAgo(0) },
  { id: 10, issue_type: 'WATERLOGGING', latitude: 10.0100, longitude: 76.3200, severity: 'HIGH', confidence: 0.91, verification_count: 4, first_detected_at: daysAgo(3), last_detected_at: daysAgo(0), status: 'VERIFIED', description: 'Recurring waterlogging near Palarivattom flyover', created_at: daysAgo(3), updated_at: daysAgo(0) },
  { id: 11, issue_type: 'BROKEN_STREETLIGHT', latitude: 10.0520, longitude: 76.2890, severity: 'LOW', confidence: 0.65, verification_count: 1, first_detected_at: daysAgo(4), last_detected_at: daysAgo(4), status: 'NEW', description: 'Possible streetlight issue — needs on-site verification.', created_at: daysAgo(4), updated_at: daysAgo(4) },
  { id: 12, issue_type: 'ROAD_OBSTACLE', latitude: 10.0020, longitude: 76.3050, severity: 'MEDIUM', confidence: 0.84, verification_count: 2, first_detected_at: daysAgo(6), last_detected_at: daysAgo(5), status: 'RESOLVED', description: 'Construction debris cleared from Vyttila junction', created_at: daysAgo(6), updated_at: daysAgo(1) },
  { id: 13, issue_type: 'ZEBRA_CROSSING_DAMAGE', latitude: 10.0310, longitude: 76.3470, severity: 'HIGH', confidence: 0.90, verification_count: 6, first_detected_at: daysAgo(25), last_detected_at: daysAgo(2), status: 'REPORTED', description: 'Almost invisible zebra crossing near hospital', created_at: daysAgo(25), updated_at: daysAgo(2) },
  { id: 14, issue_type: 'ROAD_SIGN_OR_MARKING_DAMAGE', latitude: 10.0400, longitude: 76.2950, severity: 'MEDIUM', confidence: 0.80, verification_count: 3, first_detected_at: daysAgo(10), last_detected_at: daysAgo(4), status: 'UNDER_REVIEW', description: 'Missing lane markings on Seaport-Airport road', created_at: daysAgo(10), updated_at: daysAgo(4) },
  { id: 15, issue_type: 'POTHOLE', latitude: 9.9750, longitude: 76.2850, severity: 'LOW', confidence: 0.72, verification_count: 1, first_detected_at: daysAgo(2), last_detected_at: daysAgo(2), status: 'NEW', description: 'Small surface crack developing near Thoppumpady bridge', created_at: daysAgo(2), updated_at: daysAgo(2) },
  { id: 16, issue_type: 'TRAFFIC_SIGNAL_DAMAGE', latitude: 10.0180, longitude: 76.3350, severity: 'HIGH', confidence: 0.83, verification_count: 4, first_detected_at: daysAgo(9), last_detected_at: daysAgo(1), status: 'VERIFIED', description: 'Signal timing irregular at Kaloor junction. Cross-bus verification confirms issue.', created_at: daysAgo(9), updated_at: daysAgo(1) },
];

const MOCK_STATS: DashboardStats = {
  total_issues: MOCK_ISSUES.length,
  critical_issues: MOCK_ISSUES.filter(i => i.severity === 'CRITICAL').length,
  under_repair: MOCK_ISSUES.filter(i => i.status === 'IN_PROGRESS').length,
  resolved: MOCK_ISSUES.filter(i => i.status === 'RESOLVED').length,
  active_buses: MOCK_BUSES.filter(b => b.status === 'ACTIVE').length,
  verified_issues: MOCK_ISSUES.filter(i => i.status === 'VERIFIED').length,
};

const MOCK_ACTIVITY = [
  { id: 1, type: 'DETECTION', message: 'New pothole detected on Route 1 - City Center', timestamp: daysAgo(0) },
  { id: 2, type: 'VERIFICATION', message: 'Waterlogging on University Road verified by 3 buses', timestamp: daysAgo(0) },
  { id: 3, type: 'STATUS', message: 'Issue #5 (Zebra crossing) moved to IN_PROGRESS', timestamp: daysAgo(0) },
  { id: 4, type: 'DETECTION', message: 'Possible traffic signal issue at Edappally junction', timestamp: daysAgo(1) },
  { id: 5, type: 'RESOLVED', message: 'Road obstacle at Vyttila junction cleared and resolved', timestamp: daysAgo(1) },
  { id: 6, type: 'VERIFICATION', message: 'Pothole on NH66 confirmed by Bus KL-01-EF-9012', timestamp: daysAgo(2) },
  { id: 7, type: 'DETECTION', message: 'Broken streetlight detected near Aluva bus stand', timestamp: daysAgo(3) },
  { id: 8, type: 'STATUS', message: 'Issue #7 (Road sign damage) resolved', timestamp: daysAgo(3) },
];

function generateTimeSeriesData() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    data.push({ date: d.toISOString().split('T')[0], count: Math.floor(Math.random() * 8) + 1 });
  }
  return data;
}

const MOCK_SEVERITY_DIST = [
  { severity: 'CRITICAL', count: MOCK_ISSUES.filter(i => i.severity === 'CRITICAL').length },
  { severity: 'HIGH', count: MOCK_ISSUES.filter(i => i.severity === 'HIGH').length },
  { severity: 'MEDIUM', count: MOCK_ISSUES.filter(i => i.severity === 'MEDIUM').length },
  { severity: 'LOW', count: MOCK_ISSUES.filter(i => i.severity === 'LOW').length },
];

const MOCK_ROUTE_STATS = [
  { route: 'Route 1 - City Center', count: 12 },
  { route: 'Route 2 - Airport Road', count: 8 },
  { route: 'Route 3 - University Loop', count: 15 },
  { route: 'Route 4 - Marine Drive', count: 6 },
  { route: 'Route 5 - Technopark', count: 9 },
  { route: 'Route 6 - Hill Palace', count: 4 },
  { route: 'Route 7 - Fort Kochi', count: 7 },
  { route: 'Route 8 - Edappally Junction', count: 11 },
];

// ---- API wrapper: tries real backend, falls back to mock ----

async function tryApi<T>(apiCall: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const result = await apiCall();
    return result;
  } catch {
    console.warn('[BusPlus] Backend unavailable — using mock data');
    return fallback;
  }
}

export const apiService = {
  // Auth
  login: async (email: string, password: string) => {
    return tryApi(
      async () => { const r = await api.post('/auth/login', { email, password }); return r.data; },
      { access_token: 'mock-jwt-token', token_type: 'bearer', user: { id: 1, name: 'Admin', email: 'admin@busplus.com', role: 'ADMIN' } }
    );
  },

  getMe: async () => {
    return tryApi(
      async () => { const r = await api.get('/auth/me'); return r.data; },
      { id: 1, name: 'Admin', email: 'admin@busplus.com', role: 'ADMIN' }
    );
  },

  // Buses
  getBuses: async (): Promise<Bus[]> => {
    return tryApi(
      async () => { const r = await api.get('/buses'); return r.data.items ?? r.data; },
      MOCK_BUSES
    );
  },

  getBus: async (id: number): Promise<Bus> => {
    return tryApi(
      async () => { const r = await api.get(`/buses/${id}`); return r.data; },
      MOCK_BUSES.find(b => b.id === id) ?? MOCK_BUSES[0]
    );
  },

  // Detections
  getDetections: async (filters?: Record<string, string>): Promise<Detection[]> => {
    return tryApi(
      async () => { const r = await api.get('/detections', { params: filters }); return r.data.items ?? r.data; },
      []
    );
  },

  createDetection: async (data: Partial<Detection>) => {
    return tryApi(
      async () => { const r = await api.post('/detections', data); return r.data; },
      { ...data, id: Date.now() }
    );
  },

  // Issues
  getIssues: async (filters?: Record<string, string>): Promise<RoadIssue[]> => {
    return tryApi(
      async () => { const r = await api.get('/issues', { params: filters }); return r.data.items ?? r.data; },
      MOCK_ISSUES
    );
  },

  getIssue: async (id: number): Promise<RoadIssue> => {
    return tryApi(
      async () => { const r = await api.get(`/issues/${id}`); return r.data; },
      MOCK_ISSUES.find(i => i.id === id) ?? MOCK_ISSUES[0]
    );
  },

  updateIssueStatus: async (id: number, status: string, description?: string) => {
    return tryApi(
      async () => { const r = await api.patch(`/issues/${id}/status`, { status, description }); return r.data; },
      { ...MOCK_ISSUES.find(i => i.id === id), status }
    );
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    return tryApi(
      async () => { const r = await api.get('/dashboard/stats'); return r.data; },
      MOCK_STATS
    );
  },

  getHeatmapData: async (): Promise<HeatmapPoint[]> => {
    return tryApi(
      async () => { const r = await api.get('/dashboard/heatmap'); return r.data; },
      MOCK_ISSUES.map(i => ({ latitude: i.latitude, longitude: i.longitude, intensity: i.severity === 'CRITICAL' ? 1.0 : i.severity === 'HIGH' ? 0.75 : i.severity === 'MEDIUM' ? 0.5 : 0.25, issue_type: i.issue_type }))
    );
  },

  getRecentIssues: async (): Promise<RoadIssue[]> => {
    return tryApi(
      async () => { const r = await api.get('/dashboard/recent'); return r.data; },
      [...MOCK_ISSUES].sort((a, b) => new Date(b.last_detected_at).getTime() - new Date(a.last_detected_at).getTime()).slice(0, 6)
    );
  },

  getActivity: async () => {
    return tryApi(
      async () => { const r = await api.get('/dashboard/activity'); return r.data; },
      MOCK_ACTIVITY
    );
  },

  // Analytics
  getAnalyticsIssues: async () => {
    return tryApi(
      async () => { const r = await api.get('/analytics/issues'); return r.data; },
      generateTimeSeriesData()
    );
  },

  getAnalyticsSeverity: async () => {
    return tryApi(
      async () => { const r = await api.get('/analytics/severity'); return r.data; },
      MOCK_SEVERITY_DIST
    );
  },

  getAnalyticsRoutes: async () => {
    return tryApi(
      async () => { const r = await api.get('/analytics/routes'); return r.data; },
      MOCK_ROUTE_STATS
    );
  },
};
