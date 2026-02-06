
import React from 'react';
import { AgentState } from '../../types';
import { parseEnvFile } from '../../utils/agentUtils';
import { ManifestSection } from './structure/ManifestSection';
import { EnvSection } from './structure/EnvSection';

interface ViewProps {
  state: AgentState;
  onApproveStructure?: () => void;
  onRemoveStructureItem?: (index: number) => void;
  onUpdateEnvVar?: (key: string, value: string | null) => void;
}

export const StructurePreviewView: React.FC<ViewProps> = ({ state, onApproveStructure, onRemoveStructureItem, onUpdateEnvVar }) => {
  const envData = parseEnvFile(state.fileSystem['.env']?.content || "");

  return (
    <div className="flex-1 p-12 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-white tracking-tighter">Project Blueprint</h3>
            <p className="text-gray-400 font-medium">Verifying architectural integrity before generating code assets.</p>
          </div>
          <button onClick={onApproveStructure} className="bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
            Finalize & Run
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <ManifestSection 
            structure={state.previewStructure} 
            onRemoveItem={onRemoveStructureItem} 
          />
          <EnvSection 
            envData={envData} 
            onUpdateEnvVar={onUpdateEnvVar} 
          />
        </div>
      </div>
    </div>
  );
};
