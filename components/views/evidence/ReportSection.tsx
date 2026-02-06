
import React from 'react';
import { VerificationReport } from '../../../types';

export const ReportSection: React.FC<{ report: VerificationReport }> = ({ report }) => (
  <section className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
    <div className={`h-1.5 w-full ${report.finalStatus === 'COMPLETE' ? 'bg-emerald-500' : 'bg-amber-500'} shadow-[0_0_15px_rgba(16,185,129,0.3)]`} />
    <div className="p-10">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-3xl font-black text-white mb-2 tracking-tight">System Audit Report</h3>
          <p className="text-gray-400 text-sm font-medium">Validation of autonomous development lifecycle.</p>
        </div>
        <div className={`px-8 py-3 rounded-2xl border-2 flex items-center gap-4 ${
          report.finalStatus === 'COMPLETE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
          <div className={`w-3.5 h-3.5 rounded-full animate-pulse ${report.finalStatus === 'COMPLETE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-lg font-black uppercase tracking-widest">{report.finalStatus}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
          <h4 className="text-[11px] uppercase font-black text-emerald-500 tracking-[0.2em]">Verified</h4>
          <div className="space-y-2">
            {report.verifiedRequirements.map(req => (
              <div key={req} className="flex items-center gap-3 text-sm text-gray-200">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {req}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
          <h4 className="text-[11px] uppercase font-black text-amber-500 tracking-[0.2em]">Blocked</h4>
          <div className="space-y-2">
            {report.unverifiedRequirements.map(req => (
              <div key={req.id} className="p-2 bg-black/40 rounded border border-white/5 text-[10px] text-gray-400">
                <span className="text-amber-400 font-bold">{req.id}:</span> {req.reason}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
          <h4 className="text-[11px] uppercase font-black text-indigo-500 tracking-[0.2em]">Risks</h4>
          <div className="space-y-2 text-[10px] text-gray-400">
            {report.residualRisks.map((risk, i) => <div key={i}>• {risk}</div>)}
          </div>
        </div>
      </div>
    </div>
  </section>
);
