import { NextRequest, NextResponse } from 'next/server'
import { databaseService as db } from '@/lib/database-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the id from params - now properly awaited
    const { id } = await params
    
    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Get conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to get conversation' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the id from params - now properly awaited
    const { id } = await params
    
    await db.conversation.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the id from params - now properly awaited
    const { id } = await params
    
    const { title, isPinned, isArchived } = await request.json()

    const conversation = await db.conversation.update({
      where: { id },
      data: {
        title,
        isPinned,
        isArchived
      }
    })

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Update conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
}