import { NextRequest, NextResponse } from 'next/server'
import { databaseService as db } from '@/lib/database-service'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params

    // First, get the current pinned status
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      select: { isPinned: true }
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Toggle the pinned status
    const updatedConversation = await db.conversation.update({
      where: { id: conversationId },
      data: { isPinned: !conversation.isPinned }
    })

    // Add null check for updatedConversation
    if (!updatedConversation) {
      return NextResponse.json(
        { error: 'Failed to update conversation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ isPinned: updatedConversation.isPinned })
  } catch (error) {
    console.error('Toggle pin error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle pin status' },
      { status: 500 }
    )
  }
}