import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { databaseService as db } from '@/lib/database-service'
import { simpleStorage } from '@/lib/simple-storage'
import { GPTService } from '@/services/gptService'
import { GeminiService } from '@/services/geminiService'
import { ClaudeService } from '@/services/claudeService'
import { OpenRouterService } from '@/services/openrouterService'

// Helper function to get user ID from request (similar to other API routes)
async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  console.log('Getting user ID from request in chat route')
  
  // Try to get user ID from headers
  const userId = request.headers.get('x-user-id')
  console.log('User ID from headers:', userId)
  
  // If not in headers, try to get from cookies
  if (!userId) {
    const cookieHeader = request.headers.get('cookie')
    console.log('Cookie header:', cookieHeader)
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
      const userCookie = cookies.find(cookie => cookie.startsWith('user='))
      console.log('User cookie:', userCookie)
      if (userCookie) {
        try {
          const userJson = decodeURIComponent(userCookie.split('=')[1])
          console.log('User JSON:', userJson)
          const user = JSON.parse(userJson)
          // Validate that the user object has an ID
          if (user.id && user.id.trim() !== '') {
            // Check if user data is still valid (not expired)
            if (!user.expiresAt || user.expiresAt > Date.now()) {
              console.log('Parsed user:', user)
              return user.id
            } else {
              console.log('User session expired')
              return null
            }
          }
        } catch (e) {
          console.error('Error parsing user cookie:', e)
        }
      }
    }
  }
  
  // Fallback to default user if not provided (for development)
  if (!userId) {
    console.log('No user ID found, using default-user')
    return 'default-user'
  }
  
  console.log('Final user ID:', userId)
  return userId
}

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId, model = 'gpt' } = await request.json()

    console.log('Received request:', { messages, conversationId })

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Get user ID from request
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid user ID found' },
        { status: 401 }
      )
    }

    // Create conversation if not exists
    let finalConversationId = conversationId
    if (!finalConversationId) {
      try {
        // Create new conversation in database
        const conversation = await db.conversation.create({
          data: {
            title: messages[messages.length - 1]?.content?.substring(0, 50) + '...' || 'New Chat',
            userId: userId // Use the actual user ID instead of hardcoded 'default-user'
          }
        })
        finalConversationId = conversation.id
        console.log('Created new conversation with database:', finalConversationId, 'for user:', userId)
      } catch (dbError) {
        console.error('Database error when creating conversation:', dbError)
        return NextResponse.json(
          { error: 'Failed to create conversation in database' },
          { status: 500 }
        )
      }
    }

    // Validate that the conversation exists and belongs to the user before proceeding
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
      
      // Check if the conversation belongs to the current user
      if (conversationExists.userId !== userId) {
        console.error('Unauthorized access to conversation:', finalConversationId, 'User:', userId)
        return NextResponse.json(
          { error: 'Unauthorized access to conversation' },
          { status: 403 }
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
          if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured');
          }
          break;
        case 'gemini':
          aiService = new GeminiService();
          serviceName = 'Gemini';
          // Allow OPENAI_API_KEY as fallback
          if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
            throw new Error('Gemini API key not configured (no fallback available)');
          }
          break;
        case 'claude':
          aiService = new ClaudeService();
          serviceName = 'Claude';
          // Allow OPENAI_API_KEY as fallback
          if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
            throw new Error('Anthropic API key not configured (no fallback available)');
          }
          break;
        case 'openrouter':
          aiService = new OpenRouterService();
          serviceName = 'OpenRouter';
          // Allow OPENAI_API_KEY as fallback
          if (!process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY) {
            throw new Error('OpenRouter API key not configured (no fallback available)');
          }
          break;
        default:
          // Default to GPT service if model is not specified or unsupported
          aiService = new GPTService();
          serviceName = 'GPT';
          if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured');
          }
          break;
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
      
      // Clean up the AI response by removing excessive spacing and markdown characters
      const cleanedResponse = cleanAiResponse(aiResponse)

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
            content: cleanedResponse,
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
        response: cleanedResponse,
        conversationId: finalConversationId
      })

      return NextResponse.json({
        response: cleanedResponse,
        conversationId: finalConversationId
      })

    } catch (aiError: any) {
      // Handle AI service specific errors with automatic fallback
      console.error(`${serviceName} API Error:`, {
        message: aiError?.message,
        error: aiError
      })
      
      // Check if it's a quota/rate limit error and try fallback providers
      const isQuotaError = aiError?.message?.includes('quota') || 
                          aiError?.message?.includes('429') ||
                          aiError?.message?.includes('rate limit') ||
                          aiError?.message?.includes('Insufficient balance')
      
      if (isQuotaError && model === 'gpt') {
        console.log(`${serviceName} quota exceeded, trying fallback providers...`);
        
        // Try Gemini first as fallback
        try {
          // Use OPENAI_API_KEY as fallback if GEMINI_API_KEY is not provided
          if ((process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') || 
              process.env.OPENAI_API_KEY) {
            console.log('Attempting fallback to Gemini...');
            const geminiService = new GeminiService();
            const aiResponse = await geminiService.generateResponse(messages);
            const cleanedResponse = cleanAiResponse(aiResponse);
            
            // Save messages to database
            const userMessage = messages[messages.length - 1];
            await db.message.create({
              data: {
                content: userMessage.content,
                role: userMessage.role,
                conversationId: finalConversationId
              }
            });
            
            await db.message.create({
              data: {
                content: `*Note: Switched to Gemini due to OpenAI quota limit*\n\n${cleanedResponse}`,
                role: 'assistant',
                conversationId: finalConversationId
              }
            });
            
            return NextResponse.json({
              response: `*Note: Switched to Gemini due to OpenAI quota limit*\n\n${cleanedResponse}`,
              conversationId: finalConversationId
            });
          }
        } catch (geminiError) {
          console.log('Gemini fallback failed, trying Claude...', geminiError);
        }
        
        // Try Claude as second fallback
        try {
          // Use OPENAI_API_KEY as fallback if ANTHROPIC_API_KEY is not provided
          if ((process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your-anthropic-api-key-here') || 
              process.env.OPENAI_API_KEY) {
            console.log('Attempting fallback to Claude...');
            const claudeService = new ClaudeService();
            const aiResponse = await claudeService.generateResponse(messages);
            const cleanedResponse = cleanAiResponse(aiResponse);
            
            // Save messages to database
            const userMessage = messages[messages.length - 1];
            await db.message.create({
              data: {
                content: userMessage.content,
                role: userMessage.role,
                conversationId: finalConversationId
              }
            });
            
            await db.message.create({
              data: {
                content: `*Note: Switched to Claude due to OpenAI quota limit*\n\n${cleanedResponse}`,
                role: 'assistant',
                conversationId: finalConversationId
              }
            });
            
            return NextResponse.json({
              response: `*Note: Switched to Claude due to OpenAI quota limit*\n\n${cleanedResponse}`,
              conversationId: finalConversationId
            });
          }
        } catch (claudeError) {
          console.log('Claude fallback failed, trying OpenRouter...', claudeError);
        }
        
        // Try OpenRouter as final fallback
        try {
          // Use OPENAI_API_KEY as fallback if OPENROUTER_API_KEY is not provided
          if ((process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your-openrouter-api-key-here') || 
              process.env.OPENAI_API_KEY) {
            console.log('Attempting fallback to OpenRouter...');
            const openrouterService = new OpenRouterService();
            const aiResponse = await openrouterService.generateResponse(messages);
            const cleanedResponse = cleanAiResponse(aiResponse);
            
            // Save messages to database
            const userMessage = messages[messages.length - 1];
            await db.message.create({
              data: {
                content: userMessage.content,
                role: userMessage.role,
                conversationId: finalConversationId
              }
            });
            
            await db.message.create({
              data: {
                content: `*Note: Switched to OpenRouter due to ${serviceName} quota limit*\n\n${cleanedResponse}`,
                role: 'assistant',
                conversationId: finalConversationId
              }
            });
            
            return NextResponse.json({
              response: `*Note: Switched to OpenRouter due to ${serviceName} quota limit*\n\n${cleanedResponse}`,
              conversationId: finalConversationId
            });
          }
        } catch (openrouterError) {
          console.log('OpenRouter fallback failed', openrouterError);
        }
      }
      
      // If no fallback worked or it's not a quota error, save error message to database
      try {
        const userMessage = messages[messages.length - 1]
        await db.message.create({
          data: {
            content: userMessage.content,
            role: userMessage.role,
            conversationId: finalConversationId
          }
        })
        
        let errorMessage = isQuotaError ? 
          `${serviceName} quota/balance exceeded and no fallback providers are available. Please recharge your account or configure additional AI providers.` :
          `${serviceName} service error: ${aiError?.message || 'Unknown error'}`
        
        // Clean the error message as well
        errorMessage = cleanAiResponse(errorMessage);
        
        await db.message.create({
          data: {
            content: errorMessage,
            role: 'assistant',
            conversationId: finalConversationId
          }
        })
        
        return NextResponse.json({
          response: errorMessage,
          conversationId: finalConversationId
        })
      } catch (dbError) {
        console.error('Database error when saving error message:', dbError)
        // Clean the error message before sending it
        const cleanedErrorMessage = cleanAiResponse(`${serviceName} service error: ${aiError?.message || 'Unknown error'}`);
        return NextResponse.json({
          response: cleanedErrorMessage,
          conversationId: finalConversationId
        })
      }
    }
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

// Helper function to clean up AI responses
function cleanAiResponse(response: string): string {
  if (!response) return response;
  
  // Remove excessive newlines (more than 2 consecutive newlines)
  let cleaned = response.replace(/\n{3,}/g, '\n\n');
  
  // Remove leading and trailing whitespace
  cleaned = cleaned.trim();
  
  // Remove markdown heading characters (#) at the beginning of lines
  cleaned = cleaned.replace(/^#+\s*/gm, '');
  
  // More carefully remove markdown bold/italic characters (*) 
  // Remove ** but preserve content inside
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // Remove single * but preserve list items and content
  // This is tricky - let's remove * only when not at start of line
  cleaned = cleaned.replace(/(?<!^)\*(?!\s)/g, '');
  
  // Remove markdown underline characters (_) but preserve content inside
  cleaned = cleaned.replace(/__(.*?)__/g, '$1');
  cleaned = cleaned.replace(/(?<!^)_(?!\s)/g, '');
  
  // Clean up any remaining excessive spacing while preserving paragraph breaks
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');
  
  // Ensure we don't have more than 2 consecutive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned;
}