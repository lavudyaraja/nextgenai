import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export class GPTService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
      baseURL: "https://api.openai.com/v1"
    });
  }

  async generateResponse(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
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
        max_tokens: 1000
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('GPT API Error:', error);
      throw new Error(`Failed to get response from GPT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}