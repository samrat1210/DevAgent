
import React, { RefObject } from 'react';
import { ActivityLog } from '../types';
import { TerminalIcon } from './Icons';

interface ConsoleProps {
  logs: ActivityLog[];
  logEndRef: RefObject<HTMLDivElement | null>;
}

export const Console: React.FC<ConsoleProps> = ({ logs, logEndRef }) => (
  <div className="h-48 border-t border-gray-800 bg-gray-900/80 backdrop-blur-md shrink-0">
    <div className="px-4 py-2 border-b border-gray-800 flex items-center gap-2">
      <TerminalIcon className="w-3 h-3 text-gray-500" />
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Console</span>
    </div>
    <div className="p-3 overflow-y-auto h-32 font-mono text-[11px] space-y-1 custom-scrollbar">
      {logs.map((log, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-gray-600">[{log.timestamp}]</span>
          <span className={
            log.type === 'success' ? 'text-green-400' : 
            log.type === 'error' ? 'text-red-400' : 
            log.type === 'ai' ? 'text-indigo-400' : 'text-gray-400'
          }>
            {log.message}
          </span>
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  </div>
);
