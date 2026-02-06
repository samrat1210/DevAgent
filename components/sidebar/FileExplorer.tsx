
import React from 'react';
import { FileSystem } from '../../types';
import { FileIcon } from '../Icons';

interface Props {
  fs: FileSystem;
  current: string | null;
  onFileSelect: (path: string) => void;
}

export const FileExplorer: React.FC<Props> = ({ fs, current, onFileSelect }) => (
  <div className="p-4 border-b border-gray-800">
    <h2 className="uppercase text-[10px] font-black text-gray-500 mb-3 tracking-widest flex justify-between items-center">
      Filesystem
      <span className="text-[9px] px-2 py-0.5 bg-gray-800 rounded-full text-gray-400 font-mono border border-gray-700">
        {Object.keys(fs).length}
      </span>
    </h2>
    <div className="space-y-0.5 max-h-[250px] overflow-y-auto custom-scrollbar">
      {Object.entries(fs).map(([path]) => (
        <button
          key={path}
          onClick={() => onFileSelect(path)}
          className={`w-full text-left px-3 py-1.5 rounded-md flex items-center gap-2.5 transition-all text-xs ${
            current === path 
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/10' 
              : 'hover:bg-gray-800 text-gray-400 border border-transparent'
          }`}
        >
          <FileIcon className="w-4 h-4 shrink-0 opacity-60" />
          <span className="truncate">{path}</span>
        </button>
      ))}
      {Object.keys(fs).length === 0 && (
        <div className="text-gray-700 italic px-3 text-[11px] py-4 border border-dashed border-gray-800 rounded-lg text-center">
          Awaiting generation...
        </div>
      )}
    </div>
  </div>
);
