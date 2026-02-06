
import React, { useState } from 'react';

interface Props {
  envData: Record<string, string>;
  onUpdateEnvVar?: (key: string, value: string | null) => void;
}

export const EnvSection: React.FC<Props> = ({ envData, onUpdateEnvVar }) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (newKey && onUpdateEnvVar) {
      onUpdateEnvVar(newKey, newValue);
      setNewKey('');
      setNewValue('');
    }
  };

  return (
    <div className="space-y-6">
      <h4 className="text-[10px] uppercase font-black text-amber-500 tracking-[0.2em] ml-2">Environment Configuration</h4>
      <div className="bg-gray-900 border border-amber-500/20 rounded-[2rem] p-6 shadow-2xl space-y-6">
        <div className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
          {Object.entries(envData).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between gap-3 p-3 bg-black/40 rounded-xl border border-white/5 group">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black text-amber-500/70 uppercase tracking-tighter truncate">{key}</div>
                <div className="text-xs text-gray-400 font-mono truncate">{val}</div>
              </div>
              <button onClick={() => onUpdateEnvVar?.(key, null)} className="opacity-0 group-hover:opacity-100 text-red-500/60 hover:text-red-500 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-gray-800 space-y-3">
          <input type="text" placeholder="VAR_NAME" value={newKey} onChange={e => setNewKey(e.target.value)} className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2 text-[11px] text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono" />
          <div className="flex gap-2">
            <input type="text" placeholder="Value" value={newValue} onChange={e => setNewValue(e.target.value)} className="flex-1 bg-black/40 border border-gray-800 rounded-xl px-4 py-2 text-[11px] text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono" />
            <button onClick={handleAdd} className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95">ADD</button>
          </div>
        </div>
      </div>
    </div>
  );
};
