import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { databaseService as db } from '@/lib/database-service'
import { simpleStorage } from '@/lib/simple-storage'

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId } = await request.json()

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

    // Check for API keys (prioritize OpenRouter)
    const openRouterKey = process.env.OPENROUTER_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY
    
    console.log('API Keys Check:', {
      hasOpenRouter: !!openRouterKey,
      hasOpenAI: !!openaiKey,
    })
    
    if (!openRouterKey && (!openaiKey || openaiKey === "sk-your-openai-api-key-here")) {
      // Save messages to database even in test mode
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
            content: 'AI assistant is not properly configured. Please check your API keys.',
            role: 'assistant',
            conversationId: finalConversationId
          }
        })
      } catch (dbError) {
        console.error('Database error:', dbError)
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
      }
      
      return NextResponse.json({
        response: 'AI assistant is not properly configured. Please check your API keys.',
        conversationId: finalConversationId
      })
    }

    // Initialize OpenAI client (works with OpenRouter too)
    const apiKey = openRouterKey || openaiKey
    const baseURL = openRouterKey ? "https://openrouter.ai/api/v1" : "https://api.openai.com/v1"
    
    console.log('Using API Config:', {
      service: openRouterKey ? 'OpenRouter' : 'OpenAI',
      baseURL: baseURL,
    })
    
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
        "X-Title": "AI Assistant Chat"
      }
    })

    try {
      // Get AI response
      const modelToUse = openRouterKey ? 'meta-llama/llama-3.3-8b-instruct:free' : 'gpt-3.5-turbo'
      console.log('Using model:', modelToUse)
      
      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Be conversational, informative, and engaging.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'

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

    } catch (openaiError: any) {
      // Handle API specific errors (quota, billing, etc.)
      const service = openRouterKey ? "OpenRouter" : "OpenAI"
      console.error(`${service} API Error:`, {
        status: openaiError?.status,
        message: openaiError?.message,
        error: openaiError?.error,
        code: openaiError?.code
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
        
        let errorMessage = `AI service error: ${openaiError?.message || 'Unknown error'}`
        if (openaiError?.status === 429) {
          errorMessage = `${service} quota exceeded. Please check your account.`
        } else if (openaiError?.status === 401) {
          errorMessage = `${service} API key invalid. Please check your configuration.`
        }
        
        await db.message.create({
          data: {
            content: errorMessage,
            role: 'assistant',
            conversationId: finalConversationId
          }
        })
      } catch (dbError) {
        console.error('Database error when saving error message:', dbError)
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
      }
      
      return NextResponse.json({
        response: `AI service error: ${openaiError?.message || 'Unknown error'}`,
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