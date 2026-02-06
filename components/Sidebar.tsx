
import React, { useState } from 'react';
import { AgentStatus, AgentState, LLMProvider, ProviderConfig } from '../types';
import { BrainIcon } from './Icons';
import { ModelSelector } from './sidebar/ModelSelector';
import { FileExplorer } from './sidebar/FileExplorer';
import { ExecutionPlan } from './sidebar/ExecutionPlan';
import { ProviderSettings } from './settings/ProviderSettings';

interface SidebarProps {
  state: AgentState;
  onModelChange: (modelId: string) => void;
  onUpdateProvider: (id: LLMProvider, config: Partial<ProviderConfig>) => void;
  onFileSelect: (path: string) => void;
  onRetryTask?: (index: number) => void;
  onUpdateTask?: (index: number, desc: string) => void;
  onAddTask?: () => void;
  onRemoveTask?: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ state, onModelChange, onUpdateProvider, onFileSelect, onRetryTask, onUpdateTask, onAddTask, onRemoveTask }) => {
  const [showSettings, setShowSettings] = useState(false);
  const isBusy = state.status !== AgentStatus.IDLE && 
                 state.status !== AgentStatus.COMPLETED && 
                 state.status !== AgentStatus.ERROR;

  const canEditPlan = state.status === AgentStatus.PLANNING || state.status === AgentStatus.CODING || state.status === AgentStatus.IDLE;

  return (
    <aside className="w-80 border-r border-gray-800 flex flex-col bg-gray-900 shadow-2xl z-20 overflow-hidden shrink-0 relative">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg text-white tracking-tight">DevAgent</h1>
        </div>
        <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-widest">
          Agnostic
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ModelSelector 
          selected={state.selectedModel} 
          isBusy={isBusy} 
          onModelChange={onModelChange}
          onOpenSettings={() => setShowSettings(true)}
        />

        <FileExplorer 
          fs={state.fileSystem} 
          current={state.currentFile} 
          onFileSelect={onFileSelect} 
        />

        <ExecutionPlan 
          tasks={state.tasks} 
          status={state.status} 
          canEditPlan={canEditPlan} 
          isBusy={isBusy}
          onAddTask={onAddTask}
          onRemoveTask={onRemoveTask}
          onUpdateTask={onUpdateTask}
          onRetryTask={onRetryTask}
        />
      </div>

      {showSettings && (
        <ProviderSettings 
          providers={state.providers}
          onUpdate={onUpdateProvider}
          onClose={() => setShowSettings(false)}
        />
      )}
      
      <div className="p-4 bg-black/40 border-t border-gray-800 text-center">
         <div className="text-[9px] text-gray-600 uppercase font-black tracking-[0.2em]">
            Multi-Model Orchestrator
         </div>
      </div>
    </aside>
  );
};
