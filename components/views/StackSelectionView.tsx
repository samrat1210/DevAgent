
import React from 'react';
import { AgentState } from '../../types';

interface ViewProps {
  state: AgentState;
  onStackChange?: (index: number, value: string) => void;
  onConfirmStack?: () => void;
}

export const StackSelectionView: React.FC<ViewProps> = ({ state, onStackChange, onConfirmStack }) => (
  <div className="flex-1 p-12 overflow-y-auto flex items-center justify-center">
    <div className="max-w-2xl w-full bg-gray-900 border border-gray-800 rounded-[2.5rem] p-12 shadow-3xl space-y-10 animate-in zoom-in-95 duration-700">
      <header className="text-center space-y-2">
        <h3 className="text-3xl font-black text-white tracking-tight">Confirm Tech Stack</h3>
        <p className="text-gray-400 font-medium">Selection of the optimized runtime and toolchain for the project.</p>
      </header>
      <div className="grid grid-cols-1 gap-6">
        {state.suggestedStacks.map((stack, sIdx) => (
          <div key={stack.category} className="space-y-3">
            <label className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] ml-2">{stack.category}</label>
            <select 
              value={stack.selected}
              onChange={(e) => onStackChange?.(sIdx, e.target.value)}
              className="w-full bg-black/40 border-2 border-gray-800 text-white text-sm rounded-2xl p-4 outline-none focus:border-indigo-500 transition-all font-bold appearance-none cursor-pointer"
            >
              {stack.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ))}
      </div>
      <button onClick={onConfirmStack} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-[1.5rem] font-black tracking-widest uppercase transition-all shadow-2xl shadow-indigo-600/30 active:scale-95">
        Initialize Blueprint
      </button>
    </div>
  </div>
);
