
import React from 'react';
import { Play, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { AgentStatus } from '../types';

interface PromptBarProps {
  value: string;
  onChange: (val: string) => void;
  onStart: () => void;
  onImageUpload: (img: string | null) => void;
  inputImage: string | null;
  isIdle: boolean;
}

export const PromptBar: React.FC<PromptBarProps> = ({ value, onChange, onStart, onImageUpload, inputImage, isIdle }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => onImageUpload(re.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 bg-gray-950/80 border-t border-white/5 backdrop-blur-xl z-40">
      <div className="max-w-5xl mx-auto flex gap-4">
        <div className="flex-1 relative group">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="What are we constructing today? (Attach design for UI analysis...)"
            disabled={!isIdle}
            onKeyDown={(e) => e.key === 'Enter' && onStart()}
            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-6 pr-14 py-5 text-sm focus:outline-none focus:border-indigo-500 transition-all text-white placeholder-gray-600 font-medium"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
              inputImage ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-indigo-400'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>

        <button
          onClick={onStart}
          disabled={!isIdle || (!value.trim() && !inputImage)}
          className={`px-10 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-2xl font-black uppercase tracking-widest text-xs ${
            isIdle ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20' : 'bg-gray-800 text-gray-600'
          }`}
        >
          {isIdle ? <Play className="w-5 h-5 fill-current" /> : <Loader2 className="w-5 h-5 animate-spin" />}
          Construct
        </button>
      </div>

      {inputImage && (
        <div className="max-w-5xl mx-auto mt-4 animate-in slide-in-from-bottom-2">
           <div className="inline-flex items-center gap-3 p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
              <img src={inputImage} className="w-12 h-12 rounded-lg object-cover" />
              <div className="pr-4">
                 <div className="text-[10px] font-black uppercase tracking-tighter text-indigo-400">Design Payload Attached</div>
                 <div className="text-[10px] text-indigo-300 opacity-60">Design-to-Code enabled</div>
              </div>
              <button onClick={() => onImageUpload(null)} className="p-1 hover:text-red-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
