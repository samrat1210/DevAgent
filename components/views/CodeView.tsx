
import React from 'react';
import Prism from 'prismjs';
import { FileNode } from '../../types';

const detectLanguage = (path: string, content: string): string => {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  if (path === '.env') return 'bash'; // Env files use bash-like syntax highlighting
  const extMap: Record<string, string> = { 'ts': 'typescript', 'tsx': 'typescript', 'js': 'javascript', 'jsx': 'javascript', 'py': 'python', 'json': 'json', 'css': 'css', 'html': 'html', 'md': 'markdown' };
  return extMap[ext] || 'plain';
};

interface CodeViewProps {
  file: FileNode | null;
  path?: string | null;
  isFocusMode?: boolean;
  isBusy?: boolean;
}

export const CodeView: React.FC<CodeViewProps> = ({ file, path, isFocusMode, isBusy }) => (
  <div className={`flex-1 font-mono text-sm overflow-auto custom-scrollbar transition-all duration-700 ${isFocusMode ? 'bg-black/90 p-20' : 'p-10'} ${isBusy ? 'opacity-40 animate-pulse' : ''}`}>
    {file ? (
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute -top-10 left-0 text-[10px] uppercase font-black text-indigo-500/50 tracking-widest">{path}</div>
        <pre className="text-gray-300 leading-relaxed font-mono">
          <code dangerouslySetInnerHTML={{ __html: Prism.highlight(file.content, Prism.languages[detectLanguage(path || '', file.content)] || Prism.languages.plain, detectLanguage(path || '', file.content)) }} />
        </pre>
      </div>
    ) : (
      <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-20">
        <div className="w-32 h-32 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-2xl font-black uppercase tracking-widest text-white">System Idle</p>
      </div>
    )}
  </div>
);
