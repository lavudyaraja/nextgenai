import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export class OpenRouterService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || '',
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }

  async generateResponse(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'anthropic/claude-3-haiku', // Using Claude 3 Haiku via OpenRouter (cost-effective)
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
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw new Error(`Failed to get response from OpenRouter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}