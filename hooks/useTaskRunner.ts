
import { MutableRefObject } from 'react';
import { Task, FileSystem } from '../types';
import { generateCode, indexDependenciesLocal } from '../services/llmService';

export const useTaskRunner = (
  state: any,
  setState: (updater: (prev: any) => any) => void,
  tasksRef: MutableRefObject<Task[]>,
  addLog: (msg: string, type?: any, source?: string) => void,
  takeSnapshot: (label: string) => void,
  bootRuntime: () => Promise<void>
) => {
  const executeTask = async (idx: number, fs: FileSystem): Promise<FileSystem> => {
    const task = tasksRef.current[idx];
    setState(prev => ({ ...prev, tasks: prev.tasks.map((t, i) => i === idx ? { ...t, status: 'in-progress' } : t) }));
    
    try {
      addLog(`Constructing: ${task.description.slice(0, 30)}...`, "ai", state.selectedModel);
      const files = await generateCode(task.description, fs, state.selectedModel, state.providers, state.metaInsights);
      
      const updatedFS = { ...fs };
      files.forEach((f: any) => {
        updatedFS[f.path] = { name: f.path.split('/').pop()!, content: f.content, language: f.language };
      });

      setState(prev => ({ ...prev, fileSystem: updatedFS, tasks: prev.tasks.map((t, i) => i === idx ? { ...t, status: 'completed' } : t) }));
      return updatedFS;
    } catch (e: any) {
      addLog(`Task Failed: ${e.message}`, "error", "orchestrator");
      setState(prev => ({ ...prev, tasks: prev.tasks.map((t, i) => i === idx ? { ...t, status: 'failed', error: e.message } : t) }));
      throw e;
    }
  };

  const runCodingLoop = async (tasks: Task[]) => {
    let currentFS = { ...state.fileSystem };
    for (let i = 0; i < tasks.length; i++) {
      try {
        currentFS = await executeTask(i, currentFS);
      } catch (e) { break; }
    }
    
    addLog("Analyzing code integrity via local dependency mapping...", "info", "system");
    try { 
      const index = indexDependenciesLocal(currentFS);
      console.debug("Project Map:", index);
      addLog("Architecture Indexed.", "success", "system"); 
    } catch (err) { 
      addLog("Indexing failed.", "warning", "system"); 
    }
    
    bootRuntime();
  };

  return { executeTask, runCodingLoop };
};
