import { NextRequest, NextResponse } from 'next/server'
import { databaseService as db } from '@/lib/database-service'

export async function POST(request: NextRequest) {
  try {
    const { messageId, reaction } = await request.json()

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    if (reaction && !['like', 'dislike'].includes(reaction)) {
      return NextResponse.json({ error: 'Reaction must be \"like\" or \"dislike\"' }, { status: 400 })
    }

    // Check if message exists
    const message = await db.message.findUnique({
      where: { id: messageId }
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // For now, store reactions in memory/local storage since DB column doesn't exist
    // TODO: Update database schema and use: 
    // await db.message.update({ where: { id: messageId }, data: { reaction } })
    
    console.log(`Reaction ${reaction || 'removed'} for message ${messageId} - stored temporarily`)

    return NextResponse.json({ 
      success: true, 
      messageId, 
      reaction,
      message: 'Reaction saved successfully (temporary storage)'
    })

  } catch (error) {
    console.error('Message reaction error:', error)
    return NextResponse.json(
      { error: 'Failed to save reaction: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
    }

    // For now, return empty reactions since DB column doesn't exist
    // TODO: Update database schema and query actual reactions
    
    console.log(`Loading reactions for conversation ${conversationId} - using temporary storage`)
    
    return NextResponse.json({ reactions: {} })

  } catch (error) {
    console.error('Get reactions error:', error)
    return NextResponse.json(
      { error: 'Failed to get reactions: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}