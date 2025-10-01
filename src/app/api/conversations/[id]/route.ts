import { NextRequest, NextResponse } from 'next/server'
import { databaseService as db } from '@/lib/database-service'

// Helper function to get user ID from request (in a real app, this would validate a session/JWT)
async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  console.log('Getting user ID from request in individual conversation route')
  
  // Try to get user ID from headers
  const userId = request.headers.get('x-user-id')
  console.log('User ID from headers:', userId)
  
  // If not in headers, try to get from cookies
  if (!userId) {
    const cookieHeader = request.headers.get('cookie')
    console.log('Cookie header:', cookieHeader)
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
      const userCookie = cookies.find(cookie => cookie.startsWith('user='))
      console.log('User cookie:', userCookie)
      if (userCookie) {
        try {
          const userJson = decodeURIComponent(userCookie.split('=')[1])
          console.log('User JSON:', userJson)
          const user = JSON.parse(userJson)
          console.log('Parsed user:', user)
          return user.id || null
        } catch (e) {
          console.error('Error parsing user cookie:', e)
        }
      }
    }
  }
  
  console.log('Final user ID:', userId)
  return userId
}

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
    
    // Add logging for debugging
    console.log('Attempting to delete conversation with ID:', id)
    
    // Check if ID is valid
    if (!id) {
      console.log('Invalid conversation ID provided')
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }
    
    // Check if conversation exists
    const existingConversation = await db.conversation.findUnique({
      where: { id }
    })
    
    if (!existingConversation) {
      console.log('Conversation not found:', id)
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    console.log('Found conversation to delete:', existingConversation.id)
    
    const result = await db.conversation.delete({
      where: { id }
    })
    
    console.log('Successfully deleted conversation:', id)
    
    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error('Delete conversation error:', error)
    
    // Provide more detailed error information
    let errorMessage = 'Failed to delete conversation'
    let statusCode = 500
    
    if (error instanceof Error) {
      errorMessage = error.message
      // Check for specific Prisma errors
      if (errorMessage.includes('Record to delete does not exist')) {
        errorMessage = 'Conversation not found'
        statusCode = 404
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
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