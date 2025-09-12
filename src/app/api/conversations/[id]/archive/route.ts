import { NextRequest, NextResponse } from 'next/server'
import { databaseService as db } from '@/lib/database-service'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params

    // First, get the current archived status
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      select: { isArchived: true }
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Toggle the archived status
    const updatedConversation = await db.conversation.update({
      where: { id: conversationId },
      data: { isArchived: !conversation.isArchived }
    })

    // Handle the case where updatedConversation might be null
    if (!updatedConversation) {
      return NextResponse.json(
        { error: 'Failed to update conversation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ isArchived: updatedConversation.isArchived })
  } catch (error) {
    console.error('Toggle archive error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle archive status' },
      { status: 500 }
    )
  }
}