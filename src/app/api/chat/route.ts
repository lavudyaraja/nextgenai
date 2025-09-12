import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { databaseService as db } from '@/lib/database-service'
import { simpleStorage } from '@/lib/simple-storage'
import { GPTService } from '@/services/gptService'
import { GeminiService } from '@/services/geminiService'
import { ClaudeService } from '@/services/claudeService'
import { GrokService } from '@/services/grokService'

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId, model = 'gpt' } = await request.json()

    console.log('Received request:', { messages, conversationId })

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Create conversation if not exists
    let finalConversationId = conversationId
    if (!finalConversationId) {
      try {
        // Create new conversation in database
        const conversation = await db.conversation.create({
          data: {
            title: messages[messages.length - 1]?.content?.substring(0, 50) + '...' || 'New Chat',
            userId: 'default-user'
          }
        })
        finalConversationId = conversation.id
        console.log('Created new conversation with database:', finalConversationId)
      } catch (dbError) {
        console.error('Database error when creating conversation:', dbError)
        return NextResponse.json(
          { error: 'Failed to create conversation in database' },
          { status: 500 }
        )
      }
    }

    // Validate that the conversation exists before proceeding
    try {
      // First try to find in database
      let conversationExists = await db.conversation.findUnique({
        where: { id: finalConversationId }
      })
      
      // If not found in database, try SimpleStorage as fallback
      if (!conversationExists) {
        console.log(`Conversation ${finalConversationId} not found in database, checking SimpleStorage...`)
        conversationExists = simpleStorage.getConversation(finalConversationId)
        if (conversationExists) {
          console.log(`Found conversation ${finalConversationId} in SimpleStorage`)
        } else {
          console.log(`Conversation ${finalConversationId} not found in SimpleStorage either`)
        }
      }
      
      if (!conversationExists) {
        console.error('Conversation not found:', finalConversationId)
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        )
      }
    } catch (dbError) {
      console.error('Database error when validating conversation:', dbError)
      return NextResponse.json(
        { error: 'Failed to validate conversation' },
        { status: 500 }
      )
    }

    // Check which model is requested and validate API keys accordingly
    console.log('Requested model:', model)
    
    let aiService: any;
    let serviceName = 'AI'; // Initialize with default value
    
    try {
      switch (model) {
        case 'gpt':
          aiService = new GPTService();
          serviceName = 'GPT';
          if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-api-key-here') {
            throw new Error('OpenAI API key not configured');
          }
          break;
        case 'gemini':
          aiService = new GeminiService();
          serviceName = 'Gemini';
          if (!process.env.GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
          }
          break;
        case 'claude':
          aiService = new ClaudeService();
          serviceName = 'Claude';
          if (!process.env.ANTHROPIC_API_KEY) {
            throw new Error('Anthropic API key not configured');
          }
          break;
        case 'grok':
          aiService = new GrokService();
          serviceName = 'Grok';
          if (!process.env.XAI_API_KEY) {
            throw new Error('X.AI API key not configured');
          }
          break;
        default:
          throw new Error(`Unsupported model: ${model}`);
      }
    } catch (configError: any) {
      console.error('Configuration error:', configError);
      
      // Save messages to database even in error case
      const userMessage = messages[messages.length - 1]
      try {
        await db.message.create({
          data: {
            content: userMessage.content,
            role: userMessage.role,
            conversationId: finalConversationId
          }
        })
        
        await db.message.create({
          data: {
            content: `${serviceName} service is not properly configured: ${configError?.message || 'Unknown error'}`,
            role: 'assistant',
            conversationId: finalConversationId
          }
        })
      } catch (dbError) {
        console.error('Database error:', dbError)
      }
      
      return NextResponse.json({
        response: `${serviceName} service is not properly configured: ${configError?.message || 'Unknown error'}`,
        conversationId: finalConversationId
      })
    }

    try {
      console.log(`Using ${serviceName} service`)
      
      // Get AI response using the selected service
      const aiResponse = await aiService.generateResponse(messages)

      // Save user message to database
      const userMessage = messages[messages.length - 1]
      try {
        await db.message.create({
          data: {
            content: userMessage.content,
            role: userMessage.role,
            conversationId: finalConversationId
          }
        })
        console.log('Saved user message to database')
      } catch (dbError) {
        console.error('Database error when saving user message:', dbError)
        console.error('Attempted to save with conversationId:', finalConversationId)
        // Verify the conversation still exists
        try {
          const conversationExists = await db.conversation.findUnique({
            where: { id: finalConversationId }
          })
          console.log('Conversation exists:', !!conversationExists)
          if (conversationExists) {
            console.log('Conversation details:', conversationExists)
          }
        } catch (verifyError) {
          console.error('Error verifying conversation:', verifyError)
        }
        return NextResponse.json(
          { error: 'Failed to save user message to database' },
          { status: 500 }
        )
      }

      // Save AI response to database
      try {
        await db.message.create({
          data: {
            content: aiResponse,
            role: 'assistant',
            conversationId: finalConversationId
          }
        })
        console.log('Saved AI response to database')
      } catch (dbError) {
        console.error('Database error when saving AI response:', dbError)
        console.error('Attempted to save with conversationId:', finalConversationId)
        // Verify the conversation still exists
        try {
          const conversationExists = await db.conversation.findUnique({
            where: { id: finalConversationId }
          })
          console.log('Conversation exists:', !!conversationExists)
          if (conversationExists) {
            console.log('Conversation details:', conversationExists)
          }
        } catch (verifyError) {
          console.error('Error verifying conversation:', verifyError)
        }
        return NextResponse.json(
          { error: 'Failed to save AI response to database' },
          { status: 500 }
        )
      }

      console.log('Sending response:', {
        response: aiResponse,
        conversationId: finalConversationId
      })

      return NextResponse.json({
        response: aiResponse,
        conversationId: finalConversationId
      })

    } catch (aiError: any) {
      // Handle AI service specific errors
      console.error(`${serviceName} API Error:`, {
        message: aiError?.message,
        error: aiError
      })
      
      // Save error message to database
      try {
        const userMessage = messages[messages.length - 1]
        await db.message.create({
          data: {
            content: userMessage.content,
            role: userMessage.role,
            conversationId: finalConversationId
          }
        })
        
        let errorMessage = `${serviceName} service error: ${aiError?.message || 'Unknown error'}`
        
        await db.message.create({
          data: {
            content: errorMessage,
            role: 'assistant',
            conversationId: finalConversationId
          }
        })
      } catch (dbError) {
        console.error('Database error when saving error message:', dbError)
      }
      
      return NextResponse.json({
        response: `${serviceName} service error: ${aiError?.message || 'Unknown error'}`,
        conversationId: finalConversationId
      })
    }
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}