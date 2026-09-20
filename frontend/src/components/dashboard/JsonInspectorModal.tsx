import { X, Copy, Check, Code2 } from 'lucide-react';
import { useState } from 'react';
import { RoadIssue } from '../../types';

interface JsonInspectorModalProps {
  issue: RoadIssue | null;
  onClose: () => void;
}

export default function JsonInspectorModal({ issue, onClose }: JsonInspectorModalProps) {
  const [copied, setCopied] = useState(false);

  if (!issue) return null;

  const jsonPayload = {
    schema_version: "2.1.0",
    entity: "road_issue",
    id: issue.id,
    detection_type: issue.issue_type,
    confidence_score: issue.confidence,
    spatial_coordinates: {
      latitude: issue.latitude,
      longitude: issue.longitude,
      projection: "EPSG:4326 (WGS84)",
      haversine_cluster_radius_m: 20
    },
    verification_metrics: {
      verification_count: issue.verification_count,
      status: issue.status,
      confidence_level: issue.verification_count >= 3 ? "VERIFIED_CANDIDATE" : issue.verification_count === 2 ? "HIGH_CONFIDENCE" : "SINGLE_PASS"
    },
    edge_device_telemetry: {
      bus_id: (issue as any).bus_id || 4,
      model: "YOLOv8x-Road-v2.1",
      inference_time_ms: 13.4,
      frame_resolution: "1920x1080",
      bounding_box: [142, 380, 520, 680]
    },
    timestamps: {
      first_detected_at: issue.first_detected_at,
      last_detected_at: issue.last_detected_at
    }
  };

  const jsonString = JSON.stringify(jsonPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-sm tracking-tight text-white">
              API REST Telemetry Payload Inspection — Issue #{issue.id}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold transition-all text-slate-200"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / JSON Viewer */}
        <div className="p-6 overflow-y-auto font-mono text-xs bg-slate-950/90 leading-relaxed text-emerald-400 flex-1">
          <pre className="whitespace-pre-wrap">{jsonString}</pre>
        </div>

        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>GET /api/issues/{issue.id} • 200 OK (14ms)</span>
          <span>Content-Type: application/json</span>
        </div>
      </div>
    </div>
  );
}
