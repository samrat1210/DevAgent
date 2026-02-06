
import React from 'react';

interface Props {
  structure: string[];
  onRemoveItem?: (idx: number) => void;
}

export const ManifestSection: React.FC<Props> = ({ structure, onRemoveItem }) => (
  <div className="lg:col-span-2 space-y-6">
    <h4 className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] ml-2">File Manifest</h4>
    <div className="bg-gray-900 border border-gray-800 rounded-[2rem] p-4 font-mono text-[13px] shadow-2xl overflow-hidden ring-1 ring-white/5">
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-4 space-y-1">
        {structure.map((path, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group">
            <span className="flex items-center gap-4 text-gray-300 font-bold">
              <div className={`w-2 h-2 rounded-full ${path === '.env' ? 'bg-amber-500' : 'bg-indigo-500/50'}`} />
              {path}
            </span>
            {path !== '.env' && (
              <button 
                onClick={() => onRemoveItem?.(idx)} 
                className="opacity-0 group-hover:opacity-100 text-red-500 px-3 py-1 hover:bg-red-500/10 rounded-lg transition-all text-[10px] font-black uppercase"
              >
                Drop
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
