
import React from 'react';
import { AgentStatus } from '../types';

interface ExecutionFlowProps {
  status: AgentStatus;
}

const PHASES = [
  { 
    id: 'analysis', 
    label: 'Analysis', 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    statuses: [AgentStatus.IDLE, AgentStatus.SUGGESTING_STACK, AgentStatus.SELECTING_STACK]
  },
  { 
    id: 'architecture', 
    label: 'Blueprint', 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    statuses: [AgentStatus.GENERATING_STRUCTURE, AgentStatus.PREVIEWING_STRUCTURE]
  },
  { 
    id: 'planning', 
    label: 'Planning', 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    statuses: [AgentStatus.ANALYZING_VALIDATION, AgentStatus.PLANNING]
  },
  { 
    id: 'coding', 
    label: 'Coding', 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    statuses: [AgentStatus.CODING]
  },
  { 
    id: 'verification', 
    label: 'Audit', 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    statuses: [AgentStatus.TESTING, AgentStatus.EXECUTING, AgentStatus.COMPLETED]
  },
  { 
    id: 'evolution', 
    label: 'Evolution', 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    statuses: [AgentStatus.EVOLVING]
  }
];

export const ExecutionFlow: React.FC<ExecutionFlowProps> = ({ status }) => {
  const currentPhaseIndex = PHASES.findIndex(p => p.statuses.includes(status));
  const isError = status === AgentStatus.ERROR;

  return (
    <div className="bg-gray-900/80 border-b border-gray-800 px-8 py-3 backdrop-blur-sm shrink-0">
      <div className="max-w-4xl mx-auto flex items-center justify-between relative">
        {/* Connecting Lines Container */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex px-10">
          {PHASES.slice(0, -1).map((_, i) => (
            <div key={i} className="flex-1 h-[2px] relative bg-gray-800 mx-2">
              <div 
                className={`absolute inset-0 transition-all duration-1000 ${
                  i < currentPhaseIndex ? 'w-full bg-indigo-500' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Nodes */}
        {PHASES.map((phase, index) => {
          const isCompleted = index < currentPhaseIndex || (index === PHASES.length - 1 && status === AgentStatus.COMPLETED);
          const isActive = index === currentPhaseIndex;
          const isEvolving = phase.id === 'evolution' && isActive;

          return (
            <div key={phase.id} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                    : isActive 
                    ? isError 
                      ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : isEvolving
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-indigo-500/20 border-indigo-500 text-indigo-400 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    : 'bg-gray-900 border-gray-800 text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : phase.icon}
              </div>
              <span 
                className={`absolute top-11 text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-500 ${
                  isActive ? isEvolving ? 'text-amber-400' : 'text-indigo-400' : isCompleted ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {phase.label}
              </span>

              {/* Status Specific Tooltip-like label */}
              {isActive && (
                <div className={`absolute -bottom-8 bg-black/80 text-[9px] px-2 py-0.5 rounded border border-gray-700 text-gray-400 whitespace-nowrap animate-in fade-in slide-in-from-top-1`}>
                  {status.replace(/_/g, ' ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Visual buffer for labels */}
      <div className="h-6" />
    </div>
  );
};
