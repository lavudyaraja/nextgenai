import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export class ZAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.Z_AI_API_KEY || '',
      baseURL: 'https://api.z.ai/api/paas/v4', // Z.AI's official API endpoint
    });
  }

  async generateResponse(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'glm-4.5', // Z.AI's GLM model
        messages: [
          {
            role: 'system' as const,
            content: 'You are a helpful AI assistant. Be conversational, informative, and engaging.'
          },
          ...messages.map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content
          }))
        ] as ChatCompletionMessageParam[],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('Z.AI API Error:', error);
      throw new Error(`Failed to get response from Z.AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}