
import { WebContainer } from '@webcontainer/api';
import { FileSystem } from '../types';

let webcontainerInstance: WebContainer | null = null;

export const getWebContainer = async () => {
  if (!webcontainerInstance) {
    webcontainerInstance = await WebContainer.boot();
  }
  return webcontainerInstance;
};

export const mountFileSystem = async (wc: WebContainer, fs: FileSystem) => {
  const containerFs: any = {};
  
  Object.entries(fs).forEach(([path, file]) => {
    const parts = path.split('/');
    let current = containerFs;
    
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        current[part] = { file: { contents: file.content } };
      } else {
        current[part] = current[part] || { directory: {} };
        current = current[part].directory;
      }
    });
  });

  await wc.mount(containerFs);
};

export const runCommand = async (wc: WebContainer, command: string, args: string[], onData: (data: string) => void) => {
  const process = await wc.spawn(command, args);
  process.output.pipeTo(new WritableStream({
    write(data) { onData(data); }
  }));
  return process.exit;
};
