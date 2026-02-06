
import React from 'react';
import { AgentState, Snapshot } from '../../types';
import { motion } from 'framer-motion';
import { Rewind, Clock } from 'lucide-react';

export const TimelineView: React.FC<{ state: AgentState, onRollback: (id: string) => void }> = ({ state, onRollback }) => (
  <div className="flex-1 overflow-y-auto p-12 bg-black/10">
    <div className="max-w-4xl mx-auto space-y-12">
      <header>
        <h3 className="text-4xl font-black tracking-tighter mb-2">System Timeline</h3>
        <p className="text-gray-500 font-medium">Immutable snapshots captured during construction cycles.</p>
      </header>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/5" />
        <div className="space-y-8 relative z-10">
          {state.history.map((snap, i) => (
            <motion.div 
              key={snap.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-10 group"
            >
              <div className="w-16 h-16 bg-gray-900 border border-white/5 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                <Clock className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1 bg-gray-900/50 border border-white/5 p-6 rounded-3xl flex justify-between items-center group-hover:border-indigo-500/30 transition-all">
                <div>
                  <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-1">{snap.timestamp}</div>
                  <div className="text-lg font-bold text-white">{snap.label}</div>
                  <div className="text-xs text-gray-500 font-medium">{Object.keys(snap.fileSystem).length} files protected</div>
                </div>
                <button 
                  onClick={() => onRollback(snap.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-indigo-600 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  <Rewind className="w-4 h-4" /> Restore
                </button>
              </div>
            </motion.div>
          ))}
          {state.history.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 italic text-gray-600">
              No construction snapshots recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
