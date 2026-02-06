
import React, { useEffect, useState } from 'react';
import { AgentState } from '../../types';
import { Play, Globe, Terminal } from 'lucide-react';

export const RuntimeView: React.FC<{ state: AgentState }> = ({ state }) => {
  const [url, setUrl] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col p-12 bg-black/20 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full h-full flex flex-col space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h3 className="text-3xl font-black tracking-tighter">Live Preview</h3>
            <p className="text-gray-500 font-medium">Production-grade virtualization powered by WebContainers.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Environment Ready</span>
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
          {/* Iframe View */}
          <div className="bg-gray-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative flex flex-col">
            <div className="h-12 bg-black/40 border-b border-white/5 flex items-center px-6 gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
              </div>
              <div className="flex-1 bg-black/60 rounded-lg h-7 flex items-center px-4 gap-2 border border-white/5">
                <Globe className="w-3 h-3 text-gray-600" />
                <span className="text-[10px] text-gray-500 font-medium truncate">http://localhost:3000</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-400">
                <Play className="w-10 h-10 fill-current" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white">App Standing By</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">Click 'Start Server' in the terminal to initialize the development lifecycle.</p>
              </div>
            </div>
          </div>

          {/* Terminal Console */}
          <div className="bg-black rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col font-mono">
            <div className="h-12 bg-white/5 flex items-center px-6 gap-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Terminal Shell</span>
            </div>
            <div className="flex-1 p-6 text-[12px] text-gray-300 space-y-1 overflow-y-auto custom-scrollbar">
              <div className="text-emerald-500">Agent@DevContainer:~$ npm install</div>
              <div className="text-gray-500">added 842 packages from 450 contributors...</div>
              <div className="text-emerald-500">Agent@DevContainer:~$ npm run start</div>
              <div className="text-indigo-400">Compiled successfully!</div>
              <div className="text-white bg-indigo-600/20 px-2 py-1 inline-block rounded mt-4">Local: http://localhost:3000</div>
              <div className="animate-pulse inline-block w-2 h-4 bg-indigo-500 ml-1 translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
