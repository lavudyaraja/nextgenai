import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export class GPTService {
  private openai: OpenAI;
  private availableModels: string[] = [
    'gpt-3.5-turbo',
    'gpt-4o-mini', 
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-4'
  ];

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
      baseURL: "https://api.openai.com/v1"
    });
  }

  private async tryModel(model: string, messages: ChatCompletionMessageParam[]): Promise<string> {
    try {
      console.log(`GPT Service: Trying model ${model}`);
      
      const completion = await this.openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
      console.log(`GPT Service: Successfully got response from ${model}`);
      return response;
    } catch (error: any) {
      console.log(`GPT Service: Model ${model} failed:`, error?.message);
      throw error;
    }
  }

  async generateResponse(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string> {
    try {
      // Validate API key
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      // Prepare messages for OpenAI
      const formattedMessages: ChatCompletionMessageParam[] = [
        {
          role: 'system' as const,
          content: 'You are a helpful AI assistant. Be conversational, informative, and engaging.'
        },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        }))
      ];

      // Try models in order of preference
      let lastError: any;
      
      for (const model of this.availableModels) {
        try {
          return await this.tryModel(model, formattedMessages);
        } catch (error: any) {
          lastError = error;
          
          // If it's a 404 (model not found), try the next model
          if (error?.status === 404) {
            console.log(`Model ${model} not available, trying next model...`);
            continue;
          }
          
          // For rate limit errors (429), don't immediately fail - try other models
          if (error?.status === 429) {
            console.log(`Rate limit exceeded for ${model}, trying next model...`);
            continue;
          }
          
          // For auth errors (401, 403), don't try other models
          if (error?.status === 401) {
            throw new Error('Invalid OpenAI API key. Please check your API key configuration.');
          } else if (error?.status === 403) {
            throw new Error('Access denied to OpenAI API. Please check your account permissions.');
          }
          
          // For other errors, try the next model
          console.log(`Error with ${model}, trying next model:`, error?.message);
        }
      }
      
      // If we get here, all models failed
      console.error('All OpenAI models failed. Last error:', lastError);
      throw new Error(`All OpenAI models failed. Last error: ${lastError?.message || 'Unknown error'}`);
      
    } catch (error: any) {
      console.error('GPT Service Error:', {
        message: error?.message,
        status: error?.status,
        code: error?.code,
        type: error?.type
      });
      
      throw new Error(`Failed to get response from GPT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}