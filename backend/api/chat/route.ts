import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
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
  createdAt: Date
  updatedAt: Date
  messages?: Message[]
}

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Initialize ZAI
    const zai = await ZAI.create()

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
        conversation = dbConversation as unknown as Conversation
      }
    } else {
      // Create new conversation using DatabaseService
      const newDbConversation = await db.conversation.create({
        data: {}
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
    const completion = await zai.chat.completions.create({
      messages: aiMessages,
      temperature: 0.7,
      max_tokens: 1000
    })

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'

    // Save messages using DatabaseService
    if (conversation?.id) {
      // Save assistant message
      await db.message.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: aiResponse
        }
      })

      // Save user messages
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
    }

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation?.id
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
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

    return NextResponse.json(dbConversation)
  } catch (error) {
    console.error('Get conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to get conversation' },
      { status: 500 }
    )
  }
}