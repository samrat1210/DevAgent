
import React from 'react';
import { AgentState } from '../../types';

interface ViewProps {
  state: AgentState;
  onConfirmValidation?: () => void;
}

export const ValidationStrategyView: React.FC<ViewProps> = ({ state, onConfirmValidation }) => {
  const strategy = state.validationStrategy;
  if (!strategy) return null;
  return (
    <div className="flex-1 p-12 overflow-y-auto bg-black/20">
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <header className="space-y-2">
          <h3 className="text-4xl font-black text-white tracking-tighter">Strategic Validation Matrix</h3>
          <p className="text-gray-400 font-medium">Defining the autonomous execution boundaries and E2E coverage for the proposed architecture.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {strategy.matrix.map((cap, i) => (
            <div key={i} className="p-8 bg-gray-900 border border-gray-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-white uppercase tracking-widest">{cap.capability}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  cap.status === 'EXECUTABLE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  {cap.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">{cap.reason}</p>
            </div>
          ))}
        </div>

        <div className="bg-indigo-600 hover:bg-indigo-500 text-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center text-center space-y-6 transition-all cursor-pointer group" onClick={onConfirmValidation}>
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
          <div className="space-y-2">
            <h4 className="text-3xl font-black tracking-tight">Commence Implementation</h4>
            <p className="text-indigo-100 font-medium opacity-80">Finalize blueprinting and trigger the autonomous development cycle.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
