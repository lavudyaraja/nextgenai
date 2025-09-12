import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async generateResponse(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Updated to latest model
      
      // Gemini requires specific handling - system messages need to be prepended to first user message
      let systemPrompt = '';
      const processedMessages: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      
      // Extract system message if present
      for (const msg of messages) {
        if (msg.role === 'system') {
          systemPrompt = msg.content;
        } else if (msg.role === 'user') {
          const content = systemPrompt ? `${systemPrompt}\n\n${msg.content}` : msg.content;
          processedMessages.push({
            role: 'user',
            parts: [{ text: content }]
          });
          systemPrompt = ''; // Only add system prompt to first user message
        } else if (msg.role === 'assistant') {
          processedMessages.push({
            role: 'model',
            parts: [{ text: msg.content }]
          });
        }
      }
      
      // If no user messages but we have a system prompt, create a default user message
      if (processedMessages.length === 0 && systemPrompt) {
        processedMessages.push({
          role: 'user',
          parts: [{ text: systemPrompt }]
        });
      }

      const result = await model.generateContent({
        contents: processedMessages
      });

      const response = result.response;
      return response.text() || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`Failed to get response from Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}