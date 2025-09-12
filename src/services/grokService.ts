import OpenAI from 'openai';

export class GrokService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.XAI_API_KEY || '',
      baseURL: 'https://api.x.ai/v1',
    });
  }

  async generateResponse(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Be conversational, informative, and engaging.'
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('Grok API Error:', error);
      throw new Error(`Failed to get response from Grok: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}