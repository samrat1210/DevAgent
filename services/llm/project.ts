
import { Type } from "@google/genai";
import { StackOption, EvolutionInsight, Task, FileSystem, ProviderConfig, LLMProvider } from "../../types";
import { callLLM } from "./base";

export const suggestStacks = async (
  prompt: string, 
  modelId: string, 
  providerConfigs: Record<LLMProvider, ProviderConfig>, 
  metaInsights?: EvolutionInsight[], 
  image?: string
): Promise<StackOption[]> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      stacks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            selected: { type: Type.STRING }
          },
          required: ["category", "options", "selected"]
        }
      }
    },
    required: ["stacks"]
  };
  const text = await callLLM(modelId, `Suggest tech stacks for: "${prompt}"`, schema, providerConfigs, metaInsights, image);
  return JSON.parse(text).stacks;
};

export const generateStructure = async (
  prompt: string, 
  stacks: StackOption[], 
  modelId: string, 
  providerConfigs: Record<LLMProvider, ProviderConfig>, 
  metaInsights?: EvolutionInsight[]
): Promise<string[]> => {
  const summary = stacks.map(s => `${s.category}: ${s.selected}`).join(', ');
  const schema = {
    type: Type.OBJECT,
    properties: { files: { type: Type.ARRAY, items: { type: Type.STRING } } },
    required: ["files"]
  };
  const text = await callLLM(modelId, `Define file structure for: "${prompt}" using ${summary}`, schema, providerConfigs, metaInsights);
  return JSON.parse(text).files;
};

export const planProject = async (
  prompt: string, 
  modelId: string, 
  providerConfigs: Record<LLMProvider, ProviderConfig>, 
  metaInsights?: EvolutionInsight[]
): Promise<Task[]> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      tasks: {
        type: Type.ARRAY,
        items: { 
          type: Type.OBJECT, 
          properties: { 
            id: { type: Type.STRING }, 
            description: { type: Type.STRING } 
          }, 
          required: ["id", "description"] 
        }
      }
    },
    required: ["tasks"]
  };
  const text = await callLLM(modelId, `Create step-by-step dev tasks for: "${prompt}"`, schema, providerConfigs, metaInsights);
  return JSON.parse(text).tasks.map((t: any) => ({ ...t, status: 'pending' }));
};
