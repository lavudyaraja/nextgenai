import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { databaseService as db } from '../../../src/lib/database-service'

// Define types for our data
interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: Date
  updatedAt?: Date
  conversationId: string
  imageUrl?: string | null
}

interface Conversation {
  id: string
  title?: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
  messages?: Message[]
}

// Helper function to get user ID from request headers
function getUserIdFromRequest(request: NextRequest): string | null {
  // Try to get user ID from headers
  const userId = request.headers.get('x-user-id')
  
  // If no user ID in headers, this is an error case - don't fallback to default user in production
  if (!userId) {
    console.error('No user ID found in request headers')
    return null
  }
  
  return userId
}

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId, model } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Get user ID from request
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid user ID found' },
        { status: 401 }
      )
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })

    // Create conversation if not exists
    let conversation: Conversation | null = null
    if (conversationId) {
      // Try to find conversation using DatabaseService (which checks both database and SimpleStorage)
      const dbConversation = await db.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: true }
      })
      
      if (!dbConversation) {
        console.log(`Conversation ${conversationId} not found`)
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
      } else {
        // Check if the conversation belongs to the current user
        if (dbConversation.userId !== userId) {
          console.error('Unauthorized access to conversation:', conversationId, 'User:', userId)
          return NextResponse.json(
            { error: 'Unauthorized access to conversation' },
            { status: 403 }
          )
        }
        conversation = dbConversation as unknown as Conversation
      }
    } else {
      // Create new conversation using DatabaseService
      const newDbConversation = await db.conversation.create({
        data: {
          title: messages[messages.length - 1]?.content?.substring(0, 50) + '...' || 'New Chat',
          userId: userId // Use the actual user ID instead of hardcoded value
        }
      })
      conversation = newDbConversation as unknown as Conversation
    }

    // Get conversation history for context
    let conversationMessages: Message[] = []
    if (conversation?.messages) {
      // Use messages from the conversation object
      conversationMessages = conversation.messages
    } else if (conversation?.id) {
      // Get messages from DatabaseService
      const dbMessages = await db.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' },
        take: 10 // Limit context to last 10 messages
      })
      conversationMessages = dbMessages as unknown as Message[]
    }

    // Prepare messages for AI
    const aiMessages = [
      {
        role: 'system' as const,
        content: 'You are a helpful AI assistant. Be conversational, informative, and engaging.'
      },
      ...conversationMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      ...messages
    ]

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4o-mini', // Use the specified model or default to gpt-4o-mini
      messages: aiMessages,
      temperature: 0.7,
      max_tokens: 1000
    })

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'

    // Save messages using DatabaseService
    if (conversation?.id) {
      // Save user messages first
      for (const message of messages) {
        if (message.role === 'user') {
          await db.message.create({
            data: {
              conversationId: conversation.id,
              role: 'user',
              content: message.content
            }
          })
        }
      }
      
      // Save assistant message
      await db.message.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: aiResponse
        }
      })

      // Update conversation timestamp to ensure it appears in recent chats
      try {
        const updatedConversation = await db.conversation.update({
          where: { id: conversation.id },
          data: { 
            updatedAt: new Date(),
            title: conversation.title || messages[messages.length - 1]?.content?.substring(0, 50) + '...' || 'New Chat'
          }
        })
        
        if (updatedConversation) {
          console.log('Updated conversation timestamp:', updatedConversation.id)
        }
      } catch (updateError) {
        console.error('Failed to update conversation timestamp:', updateError)
      }
    }

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation?.id
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }

    // Get user ID from request
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid user ID found' },
        { status: 401 }
      )
    }

    // Try to find conversation using DatabaseService
    const dbConversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!dbConversation) {
      console.log(`Conversation ${conversationId} not found`)
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Check if the conversation belongs to the current user
    if (dbConversation.userId !== userId) {
      console.error('Unauthorized access to conversation:', conversationId, 'User:', userId)
      return NextResponse.json(
        { error: 'Unauthorized access to conversation' },
        { status: 403 }
      )
    }

    return NextResponse.json(dbConversation)
  } catch (error) {
    console.error('Get conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to get conversation' },
      { status: 500 }
    )
  }
}