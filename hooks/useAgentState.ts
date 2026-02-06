
import { useState } from 'react';
import { AgentState, AgentStatus, AVAILABLE_MODELS, LLMProvider, ProviderConfig, ActivityLog } from '../types';

export const useAgentState = () => {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<AgentState>(() => {
    const savedInsights = localStorage.getItem('agent_meta_insights');
    const savedProviders = localStorage.getItem('agent_providers');
    
    const defaultProviders: Record<LLMProvider, ProviderConfig> = {
      gemini: { id: 'gemini', apiKey: '', defaultModel: 'gemini-3-flash-preview' },
      openai: { id: 'openai', apiKey: '', defaultModel: 'gpt-4o' },
      anthropic: { id: 'anthropic', apiKey: '', defaultModel: 'claude-3-5-sonnet' },
      custom: { id: 'custom', apiKey: '', baseUrl: 'http://localhost:11434/v1', defaultModel: 'llama3' }
    };

    return {
      status: AgentStatus.IDLE,
      tasks: [],
      logs: [],
      currentFile: null,
      fileSystem: {},
      history: [],
      selectedModel: AVAILABLE_MODELS[0].id,
      suggestedStacks: [],
      previewStructure: [],
      providers: savedProviders ? JSON.parse(savedProviders) : defaultProviders,
      metaInsights: savedInsights ? JSON.parse(savedInsights) : [],
      version: '3.0.0-agnostic',
      isVoiceActive: false,
      inputImage: null
    };
  });

  const addLog = (message: string, type: ActivityLog['type'] = 'info', source?: string) => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, { timestamp: new Date().toLocaleTimeString(), message, type, source }]
    }));
  };

  return { state, setState, prompt, setPrompt, addLog };
};
