
import React from 'react';
import { AgentState, AgentStatus } from '../types';
import { Mic, MicOff, Code2, History, PlayCircle, Download } from 'lucide-react';

interface HeaderProps {
  state: AgentState;
  activeTab: 'code' | 'timeline' | 'preview';
  onTabChange: (tab: 'code' | 'timeline' | 'preview') => void;
  onVoiceToggle: () => void;
  onDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, activeTab, onTabChange, onVoiceToggle, onDownload }) => (
  <header className="h-16 border-b border-white/5 bg-gray-950 flex items-center px-8 justify-between shrink-0">
    <div className="flex items-center gap-6">
      <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
        {[
          { id: 'code', icon: Code2, label: 'Code' },
          { id: 'timeline', icon: History, label: 'Timeline' },
          { id: 'preview', icon: PlayCircle, label: 'Runtime' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2.5 transition-all ${
              activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button 
        onClick={onVoiceToggle}
        className={`p-3 rounded-full transition-all border ${
          state.isVoiceActive 
            ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse' 
            : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
        }`}
      >
        {state.isVoiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>

      {state.status === AgentStatus.COMPLETED && (
        <button onClick={onDownload} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
          <Download className="w-4 h-4" /> Package
        </button>
      )}

      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-white/5">
        <div className={`w-2 h-2 rounded-full ${state.status === AgentStatus.IDLE ? 'bg-gray-600' : 'bg-indigo-500 animate-pulse'}`} />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{state.status.replace(/_/g, ' ')}</span>
      </div>
    </div>
  </header>
);
