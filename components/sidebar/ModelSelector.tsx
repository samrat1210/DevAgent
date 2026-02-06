
import React from 'react';
import { AVAILABLE_MODELS } from '../../types';
import { Settings } from 'lucide-react';

interface Props {
  selected: string;
  isBusy: boolean;
  onModelChange: (m: string) => void;
  onOpenSettings: () => void;
}

export const ModelSelector: React.FC<Props> = ({ selected, isBusy, onModelChange, onOpenSettings }) => {
  const selectedModel = AVAILABLE_MODELS.find(m => m.id === selected);

  return (
    <div className="p-4 border-b border-gray-800 space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="uppercase text-[10px] font-black text-gray-500 tracking-widest">Agnostic Intelligence</h2>
        <button 
          onClick={onOpenSettings}
          className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="relative group">
        <select 
          value={selected}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 transition-all hover:border-gray-600 cursor-pointer appearance-none"
          disabled={isBusy}
        >
          {AVAILABLE_MODELS.map(model => (
            <option key={model.id} value={model.id}>{model.name} ({model.provider})</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      {selectedModel && (
        <div className="px-2 py-1 bg-black/40 rounded border border-white/5 text-[9px] text-gray-500 italic">
          {selectedModel.description}
        </div>
      )}
    </div>
  );
};
