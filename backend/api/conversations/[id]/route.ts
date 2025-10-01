import { NextRequest, NextResponse } from 'next/server'
import { databaseService as db } from '@/lib/database-service'

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get user ID from request
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid user ID found' },
        { status: 401 }
      )
    }
    
    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!conversation) {
      console.log(`Conversation ${id} not found`)
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
    
    // Check if the conversation belongs to the current user
    if (conversation.userId !== userId) {
      console.error('Unauthorized access to conversation:', id, 'User:', userId)
      return NextResponse.json(
        { error: 'Unauthorized access to conversation' },
        { status: 403 }
      )
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
    const { id } = await params
    
    // Get user ID from request
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid user ID found' },
        { status: 401 }
      )
    }
    
    // First, check if the conversation exists and belongs to the user
    const conversation = await db.conversation.findUnique({
      where: { id }
    })
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
    
    // Check if the conversation belongs to the current user
    if (conversation.userId !== userId) {
      console.error('Unauthorized access to conversation:', id, 'User:', userId)
      return NextResponse.json(
        { error: 'Unauthorized access to conversation' },
        { status: 403 }
      )
    }
    
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
    const { id } = await params
    const { title, isPinned, isArchived } = await request.json()
    
    // Get user ID from request
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid user ID found' },
        { status: 401 }
      )
    }
    
    // First, check if the conversation exists and belongs to the user
    const conversation = await db.conversation.findUnique({
      where: { id }
    })
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
    
    // Check if the conversation belongs to the current user
    if (conversation.userId !== userId) {
      console.error('Unauthorized access to conversation:', id, 'User:', userId)
      return NextResponse.json(
        { error: 'Unauthorized access to conversation' },
        { status: 403 }
      )
    }

    const conversationResult = await db.conversation.update({
      where: { id },
      data: {
        title,
        isPinned,
        isArchived
      }
    })

    return NextResponse.json(conversationResult)
  } catch (error) {
    console.error('Update conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
}