
import React from 'react';
import { LLMProvider, ProviderConfig, AgentStatus } from '../../types';
import { X, Key, Globe, Database } from 'lucide-react';

interface Props {
  providers: Record<LLMProvider, ProviderConfig>;
  onUpdate: (id: LLMProvider, updates: Partial<ProviderConfig>) => void;
  onClose: () => void;
}

export const ProviderSettings: React.FC<Props> = ({ providers, onUpdate, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in zoom-in-95">
      <div className="max-w-xl w-full bg-gray-900 border border-white/10 rounded-[2rem] shadow-3xl overflow-hidden flex flex-col max-h-[80vh]">
        <header className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white uppercase tracking-tighter">Agnostic Mesh Config</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase">De-coupling intelligence layers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {(Object.entries(providers) as [LLMProvider, ProviderConfig][]).map(([id, config]) => (
            <div key={id} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20">{id}</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Key className="w-3 h-3" /> API KEY
                  </label>
                  <input 
                    type="password" 
                    value={config.apiKey}
                    onChange={(e) => onUpdate(id, { apiKey: e.target.value })}
                    placeholder={id === 'gemini' ? "Using process.env.API_KEY" : "sk-..."}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:border-indigo-500 outline-none transition-all font-mono"
                    disabled={id === 'gemini'}
                  />
                </div>

                {(id === 'custom' || id === 'openai') && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> BASE URL
                    </label>
                    <input 
                      type="text" 
                      value={config.baseUrl || ''}
                      onChange={(e) => onUpdate(id, { baseUrl: e.target.value })}
                      placeholder="https://api.openai.com/v1"
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:border-indigo-500 outline-none transition-all font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <footer className="p-6 bg-black/40 border-t border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            Apply Agnostic Config
          </button>
        </footer>
      </div>
    </div>
  );
};
