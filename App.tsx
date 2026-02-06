
import React, { useState, useRef, useEffect } from 'react';
import { AgentStatus } from './types';
import { useDevAgent } from './hooks/useDevAgent';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Console } from './components/Console';
import { PromptBar } from './components/PromptBar';
import { ExecutionFlow } from './components/ExecutionFlow';
import { motion, AnimatePresence } from 'framer-motion';

// Views
import { StackSelectionView } from './components/views/StackSelectionView';
import { StructurePreviewView } from './components/views/StructurePreviewView';
import { CodeView } from './components/views/CodeView';
import { TimelineView } from './components/views/TimelineView';
import { RuntimeView } from './components/views/RuntimeView';

const App: React.FC = () => {
  const { state, setPrompt, prompt, handlers } = useDevAgent();
  const [activeTab, setActiveTab] = useState<'code' | 'timeline' | 'preview'>('code');
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [state.logs]);

  return (
    <div className="flex h-screen glass text-gray-100 overflow-hidden font-sans">
      <Sidebar 
        state={state} 
        onModelChange={handlers.setSelectedModel} 
        onUpdateProvider={handlers.updateProvider}
        onFileSelect={handlers.setFile}
        onAddTask={handlers.addTask}
        onRemoveTask={handlers.removeTask}
        onUpdateTask={handlers.updateTask}
        onRetryTask={handlers.retryTask}
      />

      <main className="flex-1 flex flex-col relative min-w-0">
        <Header 
          state={state}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onVoiceToggle={handlers.toggleVoice}
          onDownload={handlers.download}
        />

        <ExecutionFlow status={state.status} />

        <div className="flex-1 relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {state.status === AgentStatus.SELECTING_STACK ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="h-full">
                <StackSelectionView state={state} onConfirmStack={handlers.handleConfirmStack} onStackChange={handlers.updateStack} />
              </motion.div>
            ) : state.status === AgentStatus.PREVIEWING_STRUCTURE ? (
              <StructurePreviewView 
                state={state} 
                onApproveStructure={handlers.handleApproveStructure} 
                onUpdateEnvVar={handlers.updateEnvVar}
              />
            ) : (
              <div className="flex-1 flex flex-col">
                {activeTab === 'timeline' ? (
                  <TimelineView state={state} onRollback={handlers.rollback} />
                ) : activeTab === 'preview' ? (
                  <RuntimeView state={state} />
                ) : (
                  <CodeView file={state.currentFile ? state.fileSystem[state.currentFile] : null} path={state.currentFile} />
                )}
                <Console logs={state.logs} logEndRef={logEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>

        <PromptBar 
          value={prompt} 
          onChange={setPrompt} 
          onStart={handlers.handleStartAgent} 
          onImageUpload={handlers.setImage}
          inputImage={state.inputImage}
          isIdle={state.status === AgentStatus.IDLE || state.status === AgentStatus.COMPLETED}
        />
      </main>
      
      {state.status === AgentStatus.CODING && <div className="scanline" />}
    </div>
  );
};

export default App;
