import { NextRequest, NextResponse } from 'next/server'
import { databaseService as db } from '@/lib/database-service'

export async function GET() {
  try {
    console.log('Fetching all conversations...')
    const conversations = await db.conversation.findMany({
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 50
    })

    console.log('Returning', conversations.length, 'conversations')
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to get conversations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()
    console.log('Creating new conversation with title:', title)

    const conversation = await db.conversation.create({
      data: {
        title: title || null
      },
      include: {
        messages: true
      }
    })

    console.log('Created new conversation:', conversation.id)
    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}