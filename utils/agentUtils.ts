
import * as acorn from 'acorn';
import * as csstree from 'css-tree';

export const encode = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

// Previous utils...
export const validateFileSyntax = (path: string, content: string): { valid: boolean; error?: string; line?: number; col?: number; pos?: number } => {
  const ext = path.split('.').pop()?.toLowerCase();
  try {
    if (ext === 'json') {
      try { JSON.parse(content); } catch (e: any) { return { valid: false, error: e.message }; }
      return { valid: true };
    }
    if (ext === 'js' || ext === 'jsx' || ext === 'ts' || ext === 'tsx') {
      try { acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'module', allowAwaitOutsideFunction: true }); } catch (e: any) {
        if (ext === 'ts' || ext === 'tsx') return { valid: true };
        return { valid: false, error: e.message };
      }
    }
    return { valid: true };
  } catch (e: any) { return { valid: false, error: e.message }; }
};

export const parseEnvFile = (content: string): Record<string, string> => {
  const env: Record<string, string> = {};
  if (!content) return env;
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const index = trimmed.indexOf('=');
      if (index > -1) {
        const key = trimmed.substring(0, index).trim();
        const value = trimmed.substring(index + 1).trim();
        if (key) env[key] = value;
      }
    }
  });
  return env;
};

export const stringifyEnvFile = (env: Record<string, string>): string => Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n');
