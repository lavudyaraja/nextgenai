import { NextRequest, NextResponse } from 'next/server'
import { databaseService as db } from '@/lib/database-service'

// GET /api/conversations - List all conversations
export async function GET() {
  try {
    // Fetch conversations from database service (which uses simple storage)
    const conversations = await db.conversation.findMany({
      orderBy: { updatedAt: 'desc' }
    })
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const conversation = await db.conversation.create({
      data: body
    })
    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}