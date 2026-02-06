
import { Type } from "@google/genai";
import { FileSystem, EvolutionInsight, Task, LLMProvider, ProviderConfig } from "../../types";
import { callLLM, getGeminiClient } from "./base";

export const generateCode = async (
  task: string, 
  context: FileSystem, 
  modelId: string, 
  providerConfigs: Record<LLMProvider, ProviderConfig>, 
  metaInsights?: EvolutionInsight[]
) => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      files: {
        type: Type.ARRAY,
        items: { 
          type: Type.OBJECT, 
          properties: { 
            path: { type: Type.STRING }, 
            content: { type: Type.STRING }, 
            language: { type: Type.STRING } 
          }, 
          required: ["path", "content", "language"] 
        }
      }
    },
    required: ["files"]
  };
  const contextFiles = Object.keys(context).join(', ');
  const prompt = `Code Task: "${task}". Existing files: [${contextFiles}]. Output full file contents in JSON format.`;
  const text = await callLLM(modelId, prompt, schema, providerConfigs, metaInsights);
  return JSON.parse(text).files;
};

// Agnostic Asset: Try to generate SVG code if the model isn't Vision-capable or image model fails
export const generateAsset = async (prompt: string, providerConfigs: Record<LLMProvider, ProviderConfig>): Promise<string> => {
  try {
    const ai = getGeminiClient(process.env.API_KEY || '');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  } catch (e) {
    console.warn("Image model unavailable, falling back to SVG generation...");
  }
  
  // Fallback: Generate an SVG via LLM text call
  const svgText = await callLLM('gemini-3-flash-preview', `Generate only the raw SVG code for a minimal tech logo: ${prompt}. No markdown.`, undefined, providerConfigs);
  return `data:image/svg+xml;base64,${btoa(svgText)}`;
};

// Index dependencies using actual string matching (Agnostic local utility)
export const indexDependenciesLocal = (fs: FileSystem): string => {
  const map: Record<string, string[]> = {};
  Object.entries(fs).forEach(([path, node]) => {
    const imports = node.content.match(/from ['"](.+)['"]/g) || [];
    map[path] = imports.map(i => i.replace(/from ['"](.+)['"]/, '$1'));
  });
  return JSON.stringify(map, null, 2);
};
