
import React from 'react';
import { EvidenceNode } from '../../../types';

export const TimelineSection: React.FC<{ evidence: EvidenceNode[] }> = ({ evidence }) => (
  <div className="relative">
    <div className="absolute left-[40px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-indigo-500/0 via-indigo-500/20 to-indigo-500/0" />
    <div className="space-y-12 relative z-10">
      {evidence.map((node, i) => (
        <div key={i} className="flex gap-8 group">
          <div className={`w-20 h-20 rounded-2xl shrink-0 flex items-center justify-center border-2 transition-all duration-500 shadow-xl ${
            node.verdict === 'VERIFIED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
          }`}>
            <span className="text-2xl font-black">{node.verdict === 'VERIFIED' ? '✓' : '✗'}</span>
          </div>
          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden p-6 hover:border-gray-700 transition-all">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-48">
                <div className="text-[10px] font-black text-gray-500 uppercase mb-2">Requirement</div>
                <div className="font-mono text-indigo-400 text-sm font-black">{node.requirementId}</div>
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black text-gray-500 uppercase mb-2">Trace</div>
                <div className="p-4 bg-black rounded-xl font-mono text-[11px] text-emerald-400/80">
                  <div className="opacity-40 mb-1">$ {node.executionStep}</div>
                  {node.observedOutput}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
