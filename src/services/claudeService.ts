import Anthropic from '@anthropic-ai/sdk';

export class ClaudeService {
  private anthropic: Anthropic;

  constructor() {
    // Use OPENAI_API_KEY as fallback if ANTHROPIC_API_KEY is not provided
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || '',
    });
  }

  async generateResponse(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string> {
    try {
      // Claude requires specific message format and handling
      let systemMessage = '';
      const claudeMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

      // Process messages to separate system from conversation messages
      for (const message of messages) {
        if (message.role === 'system') {
          systemMessage = message.content;
        } else if (message.role === 'user' || message.role === 'assistant') {
          claudeMessages.push({
            role: message.role,
            content: message.content
          });
        }
      }

      // If no system message was provided, use a default one
      if (!systemMessage) {
        systemMessage = 'You are a helpful AI assistant. Be conversational, informative, and engaging.';
      }
      
      // Ensure we have at least one user message
      if (claudeMessages.length === 0) {
        claudeMessages.push({
          role: 'user',
          content: 'Hello'
        });
      }
      
      // Ensure the conversation starts with a user message
      if (claudeMessages[0]?.role !== 'user') {
        claudeMessages.unshift({
          role: 'user',
          content: 'Please respond to my previous message.'
        });
      }

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022', // Updated to latest model
        max_tokens: 1000,
        system: systemMessage,
        messages: claudeMessages
      });

      // Extract text content from the response
      const textContent = response.content
        .filter(content => content.type === 'text')
        .map(content => (content as any).text)
        .join('');

      return textContent || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error(`Failed to get response from Claude: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}