import Anthropic from '@anthropic-ai/sdk';

export class ClaudeService {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }

  async generateResponse(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string> {
    try {
      // Claude doesn't support system messages in the same way, so we need to handle them differently
      let systemMessage = '';
      const claudeMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

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

      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
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