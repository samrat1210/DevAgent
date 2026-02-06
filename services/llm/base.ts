
import { GoogleGenAI } from "@google/genai";
import { EvolutionInsight, ProviderConfig, LLMProvider } from "../../types";

export const getGeminiClient = (apiKey: string) => new GoogleGenAI({ apiKey });

export const callLLM = async (
  modelId: string, 
  prompt: string, 
  responseSchema?: any, 
  providerConfigs?: Record<LLMProvider, ProviderConfig>,
  metaInsights?: EvolutionInsight[], 
  image?: string
): Promise<string> => {
  // Determine provider based on modelId or config
  let provider: LLMProvider = 'gemini';
  if (modelId.includes('gpt')) provider = 'openai';
  if (modelId.includes('claude')) provider = 'anthropic';
  if (modelId === 'local-proxy') provider = 'custom';

  const config = providerConfigs?.[provider];
  const metaStr = metaInsights?.length 
    ? `DIRECTIVES:\n${metaInsights.map(i => `- ${i.directive}`).join('\n')}\n\n`
    : "";

  const finalPrompt = metaStr + prompt;

  // Handle Gemini (Primary in this environment)
  if (provider === 'gemini') {
    const ai = getGeminiClient(process.env.API_KEY || '');
    const contents: any[] = [{ text: finalPrompt }];
    if (image) {
      contents.push({
        inlineData: { mimeType: 'image/png', data: image.split(',')[1] || image }
      });
    }

    const response = await ai.models.generateContent({
      model: modelId.startsWith('gemini') ? modelId : 'gemini-3-flash-preview',
      contents: { parts: contents },
      config: {
        responseMimeType: responseSchema ? "application/json" : undefined,
        responseSchema: responseSchema,
      }
    });
    return response.text || "";
  }

  // Handle OpenAI / Custom / Anthropic via generic Fetch (Agnostic implementation)
  const baseUrl = config?.baseUrl || (provider === 'openai' ? 'https://api.openai.com/v1/chat/completions' : '');
  
  // provider is now narrowed to exclude 'gemini'
  if (!baseUrl) throw new Error(`Provider ${provider} base URL missing`);

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config?.apiKey || ''}`
    },
    body: JSON.stringify({
      model: modelId === 'local-proxy' ? config?.defaultModel : modelId,
      messages: [{ role: 'user', content: finalPrompt }],
      response_format: responseSchema ? { type: 'json_object' } : undefined
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message || 'LLM API Error');
  return data.choices?.[0]?.message?.content || "";
};
