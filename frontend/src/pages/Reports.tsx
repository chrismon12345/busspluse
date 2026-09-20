import { FileText, Download, Calendar, Mail } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Municipal Inspection Reports</h2>
        <p className="text-xs text-slate-500 font-medium">Export, schedule, and route road defect data to government public works departments</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs flex flex-col items-center">
        <div className="w-14 h-14 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900">Executive PDF & CSV Report Generator</h3>
        <p className="text-xs text-slate-500 max-w-md text-center mt-1">
          Export verified road hazard clusters directly to official government work orders.
        </p>

        <div className="flex gap-3 mt-6">
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export Monthly PDF Summary</span>
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Download Raw CSV Dataset</span>
          </button>
        </div>
        
        <div className="border-t border-slate-100 mt-10 pt-8 w-full max-w-4xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">Automated Workflows</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 text-center">
              <Download className="w-6 h-6 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-xs text-slate-900 mb-1">One-Click Work Orders</h4>
              <p className="text-xs text-slate-500">Export verified defect locations with high-resolution camera frames.</p>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 text-center">
              <Calendar className="w-6 h-6 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-bold text-xs text-slate-900 mb-1">Scheduled Email Digest</h4>
              <p className="text-xs text-slate-500">Automated Monday morning summary for city council infrastructure meetings.</p>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 text-center">
              <Mail className="w-6 h-6 text-indigo-600 mx-auto mb-3" />
              <h4 className="font-bold text-xs text-slate-900 mb-1">Smart Department Dispatch</h4>
              <p className="text-xs text-slate-500">Route streetlight defects to Electrical Board and potholes to PWD.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
