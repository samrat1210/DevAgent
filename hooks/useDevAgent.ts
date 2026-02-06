
import { useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { GoogleGenAI, Modality } from '@google/genai';
import { AgentStatus, Task, LLMProvider, ProviderConfig } from '../types';
import { parseEnvFile, stringifyEnvFile } from '../utils/agentUtils';
import { 
  planProject, suggestStacks, 
  generateStructure, generateAsset, indexDependenciesLocal
} from '../services/llmService';
import { getWebContainer, mountFileSystem } from '../services/runtimeService';
import { useAgentState } from './useAgentState';
import { useTaskRunner } from './useTaskRunner';

export const useDevAgent = () => {
  const { state, setState, prompt, setPrompt, addLog } = useAgentState();
  const tasksRef = useRef<Task[]>([]);
  const sessionRef = useRef<any>(null);

  useEffect(() => { tasksRef.current = state.tasks; }, [state.tasks]);
  useEffect(() => {
    localStorage.setItem('agent_providers', JSON.stringify(state.providers));
  }, [state.providers]);

  const bootRuntime = async () => {
    setState(prev => ({ ...prev, status: AgentStatus.BOOTING_RUNTIME }));
    addLog("Initializing Agnostic WebContainer Environment...", "info", "system");
    try {
      const wc = await getWebContainer();
      await mountFileSystem(wc, state.fileSystem);
      addLog("Virtualized Linux Environment Ready.", "success", "runtime");
      setState(prev => ({ ...prev, status: AgentStatus.COMPLETED }));
    } catch (e: any) { addLog(`Runtime Error: ${e.message}`, "error", "runtime"); }
  };

  // Handler to capture system state snapshots
  const takeSnapshot = (label: string) => {
    setState(prev => ({
      ...prev,
      history: [
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          label,
          fileSystem: { ...prev.fileSystem }
        },
        ...prev.history
      ]
    }));
  };

  const { runCodingLoop, executeTask } = useTaskRunner(state, setState, tasksRef, addLog, takeSnapshot, bootRuntime);

  const handlers = {
    handleStartAgent: async () => {
      if (!prompt.trim() && !state.inputImage) return;
      setState(prev => ({ ...prev, status: AgentStatus.SUGGESTING_STACK }));
      addLog(`Initiating agnostic design analysis via ${state.selectedModel}...`, 'ai', 'orchestrator');
      try {
        const stacks = await suggestStacks(prompt, state.selectedModel, state.providers, state.metaInsights, state.inputImage || undefined);
        setState(prev => ({ ...prev, suggestedStacks: stacks, status: AgentStatus.SELECTING_STACK }));
      } catch (e: any) { addLog(e.message, 'error', 'orchestrator'); }
    },
    updateProvider: (id: LLMProvider, updates: Partial<ProviderConfig>) => {
      setState(prev => ({
        ...prev,
        providers: { ...prev.providers, [id]: { ...prev.providers[id], ...updates } }
      }));
    },
    handleConfirmStack: async () => {
      setState(prev => ({ ...prev, status: AgentStatus.GENERATING_STRUCTURE }));
      try {
        const structure = await generateStructure(prompt, state.suggestedStacks, state.selectedModel, state.providers, state.metaInsights);
        setState(prev => ({ ...prev, previewStructure: structure, status: AgentStatus.PREVIEWING_STRUCTURE }));
      } catch (e: any) { addLog(e.message, 'error', 'orchestrator'); }
    },
    handleApproveStructure: async () => {
      setState(prev => ({ ...prev, status: AgentStatus.GENERATING_ASSETS }));
      addLog("Generating visual identity (Multi-modal fallback active)...", 'info', 'vision');
      try {
        const logo = await generateAsset(`Logo for ${prompt}`, state.providers);
        const tasks = await planProject(prompt, state.selectedModel, state.providers, state.metaInsights);
        setState(prev => ({ 
          ...prev, 
          assets: [{ id: 'logo', path: '/public/logo.png', data: logo, description: 'Branding' }], 
          tasks, 
          status: AgentStatus.CODING 
        }));
        runCodingLoop(tasks);
      } catch (e: any) { addLog(e.message, 'error', 'orchestrator'); setState(prev => ({ ...prev, status: AgentStatus.ERROR })); }
    },
    toggleVoice: async () => {
      if (state.isVoiceActive) { sessionRef.current?.close(); setState(p => ({ ...p, isVoiceActive: false })); return; }
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        await navigator.mediaDevices.getUserMedia({ audio: true });
        addLog("Voice Orchestration: Gemini Live enabled.", "ai", "gemini");
        sessionRef.current = await ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          config: { responseModalities: [Modality.AUDIO] },
          callbacks: {
            onopen: () => setState(p => ({ ...p, isVoiceActive: true })),
            onmessage: () => {},
            onclose: () => setState(p => ({ ...p, isVoiceActive: false })),
            onerror: () => setState(p => ({ ...p, isVoiceActive: false }))
          }
        });
      } catch (err: any) { addLog(`Voice Error: ${err.message}`, 'error', 'gemini'); }
    },
    setSelectedModel: (m: string) => setState(p => ({ ...p, selectedModel: m })),
    setFile: (path: string) => setState(p => ({ ...p, currentFile: path })),
    setImage: (img: string | null) => setState(prev => ({ ...prev, inputImage: img })),
    rollback: (id: string) => {
      const snap = state.history.find(s => s.id === id);
      if (snap) {
        setState(prev => ({ ...prev, fileSystem: snap.fileSystem, currentFile: null }));
        addLog(`System rolled back to snapshot: ${snap.label}`, 'warning', 'system');
      }
    },
    download: async () => {
      const zip = new JSZip();
      Object.entries(state.fileSystem).forEach(([p, f]) => zip.file(p, f.content));
      const b = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(b);
      const a = document.createElement('a'); a.href = url; a.download = 'devagent-source.zip'; a.click();
    },
    addTask: () => setState(prev => ({ ...prev, tasks: [...prev.tasks, { id: Date.now().toString(), description: 'Define logic...', status: 'pending' }] })),
    removeTask: (index: number) => setState(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== index) })),
    updateTask: (index: number, description: string) => setState(prev => ({ ...prev, tasks: prev.tasks.map((t, i) => i === index ? { ...t, description } : t) })),
    retryTask: (index: number) => executeTask(index, state.fileSystem),
    updateStack: (index: number, selected: string) => setState(prev => ({ ...prev, suggestedStacks: prev.suggestedStacks.map((s, i) => i === index ? { ...s, selected } : s) })),
    updateEnvVar: (key: string, value: string | null) => {
      setState(prev => {
        const env = parseEnvFile(prev.fileSystem['.env']?.content || '');
        value === null ? delete env[key] : env[key] = value;
        return { ...prev, fileSystem: { ...prev.fileSystem, '.env': { name: '.env', content: stringifyEnvFile(env), language: 'bash' } } };
      });
    }
  };

  return { state, setPrompt, prompt, handlers };
};
