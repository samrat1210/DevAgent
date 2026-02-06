
import React from 'react';
import { Task, AgentStatus } from '../../types';
import { CheckIcon, LoadingSpinner } from '../Icons';

interface Props {
  tasks: Task[];
  status: AgentStatus;
  canEditPlan: boolean;
  isBusy: boolean;
  onAddTask?: () => void;
  onRemoveTask?: (i: number) => void;
  onUpdateTask?: (i: number, d: string) => void;
  onRetryTask?: (i: number) => void;
}

export const ExecutionPlan: React.FC<Props> = ({ tasks, status, canEditPlan, isBusy, onAddTask, onRemoveTask, onUpdateTask, onRetryTask }) => (
  <div className="p-4 pb-20">
    <div className="flex justify-between items-center mb-4">
      <h2 className="uppercase text-[10px] font-black text-gray-500 tracking-widest">Orchestration</h2>
      {canEditPlan && !isBusy && (
        <button onClick={onAddTask} className="text-indigo-400 hover:text-indigo-300 text-[10px] font-black flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 rounded-md border border-indigo-500/20">
          + TASK
        </button>
      )}
    </div>
    
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div key={task.id} className="bg-black/10 p-3 rounded-xl border border-gray-800/40 hover:border-gray-700/60 transition-all">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {task.status === 'completed' && <div className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30"><CheckIcon className="w-2.5 h-2.5 text-green-500" /></div>}
              {task.status === 'in-progress' && <LoadingSpinner className="w-4 h-4 text-indigo-500" />}
              {task.status === 'pending' && <div className="w-4 h-4 border border-gray-700 rounded-full flex items-center justify-center text-[8px] font-bold text-gray-600">{index + 1}</div>}
              {task.status === 'failed' && <div className="w-4 h-4 flex items-center justify-center rounded-full border border-red-500/50 bg-red-500/10"><span className="text-[10px] font-black text-red-500">!</span></div>}
            </div>
            
            <div className="flex-1 min-w-0">
              {task.status === 'pending' && canEditPlan && !isBusy ? (
                <div className="flex items-start">
                  <textarea rows={2} value={task.description} onChange={(e) => onUpdateTask?.(index, e.target.value)} className="w-full bg-transparent border-none text-[11px] text-gray-300 focus:outline-none p-0 resize-none" />
                  <button onClick={() => onRemoveTask?.(index)} className="ml-2 text-red-500/40 hover:text-red-500">×</button>
                </div>
              ) : (
                <p className={`text-[11px] leading-snug font-medium ${task.status === 'completed' ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                  {task.description}
                </p>
              )}
              {task.status === 'failed' && onRetryTask && (
                 <button onClick={() => onRetryTask(index)} className="mt-2 text-[9px] font-black uppercase text-indigo-400 flex items-center gap-1.5">
                   Fix & Resume
                 </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
