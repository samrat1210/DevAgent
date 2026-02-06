
export interface FileNode {
  name: string;
  content: string;
  language: string;
}

export type FileSystem = Record<string, FileNode>;

// Added missing status values used in ExecutionFlow and views
export enum AgentStatus {
  IDLE = 'IDLE',
  SUGGESTING_STACK = 'SUGGESTING_STACK',
  SELECTING_STACK = 'SELECTING_STACK',
  GENERATING_STRUCTURE = 'GENERATING_STRUCTURE',
  PREVIEWING_STRUCTURE = 'PREVIEWING_STRUCTURE',
  GENERATING_ASSETS = 'GENERATING_ASSETS',
  PLANNING = 'PLANNING',
  ANALYZING_VALIDATION = 'ANALYZING_VALIDATION', // New
  CODING = 'CODING',
  TESTING = 'TESTING',
  EXECUTING = 'EXECUTING', // New
  BOOTING_RUNTIME = 'BOOTING_RUNTIME',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
  SETTINGS = 'SETTINGS',
  EVOLVING = 'EVOLVING' // New
}

export type LLMProvider = 'gemini' | 'openai' | 'anthropic' | 'custom';

export interface ProviderConfig {
  id: LLMProvider;
  apiKey: string;
  baseUrl?: string;
  defaultModel: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: LLMProvider;
  description: string;
}

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  error?: string;
  provider?: LLMProvider;
}

export interface ActivityLog {
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
  message: string;
  source?: string;
}

export interface StackOption {
  category: string;
  options: string[];
  selected: string;
}

export interface EvolutionInsight {
  id: string;
  directive: string;
  impact: 'Syntax' | 'Architecture' | 'Logic';
}

// Added Snapshot type for history tracking
export interface Snapshot {
  id: string;
  timestamp: string;
  label: string;
  fileSystem: FileSystem;
}

// Added EvidenceNode and VerificationReport for Audit views
export interface EvidenceNode {
  requirementId: string;
  verdict: 'VERIFIED' | 'FAILED';
  executionStep: string;
  observedOutput: string;
}

export interface VerificationReport {
  finalStatus: 'COMPLETE' | 'INCOMPLETE';
  verifiedRequirements: string[];
  unverifiedRequirements: { id: string; reason: string }[];
  residualRisks: string[];
}

export interface AgentState {
  status: AgentStatus;
  tasks: Task[];
  logs: ActivityLog[];
  currentFile: string | null;
  fileSystem: FileSystem;
  history: Snapshot[];
  selectedModel: string;
  suggestedStacks: StackOption[];
  previewStructure: string[];
  providers: Record<LLMProvider, ProviderConfig>;
  metaInsights: EvolutionInsight[];
  version: string;
  isVoiceActive: boolean;
  inputImage: string | null;
  // Added optional validation strategy for view support
  validationStrategy?: {
    matrix: { capability: string; status: string; reason: string }[];
  };
}

export const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', provider: 'gemini', description: 'Elite reasoning.' },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', provider: 'gemini', description: 'Fast construction.' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', description: 'Industry standard.' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', description: 'Superior coding.' },
  { id: 'local-proxy', name: 'Local Proxy', provider: 'custom', description: 'Ollama/LM Studio.' }
];
