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

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the request
    const userId = getUserIdFromRequest(request)
    
    // If no user ID, return unauthorized
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid user ID found' },
        { status: 401 }
      )
    }
    
    console.log('Fetching conversations for user:', userId)
    
    const conversations = await db.conversation.findMany({
      where: {
        userId: userId
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 50
    })

    console.log('Returning', conversations.length, 'conversations for user:', userId)
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
    const body = await request.json()
    const { action, title } = body || {}
    
    // Get the user ID from the request
    const userId = getUserIdFromRequest(request)
    
    // If no user ID, return unauthorized
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid user ID found' },
        { status: 401 }
      )
    }
    
    // Handle delete all action
    if (action === 'deleteAll') {
      console.log('Deleting all conversations for user:', userId)
      
      // First get all conversations for the current user
      const conversations = await db.conversation.findMany({
        where: {
          userId: userId
        },
        include: {
          messages: true
        }
      })
      
      let deletedMessagesCount = 0;
      let deletedConversationsCount = 0;
      
      // Delete all messages from each conversation
      for (const conversation of conversations) {
        // Delete all messages in this conversation
        for (const message of conversation.messages) {
          try {
            await db.message.delete({
              where: { id: message.id }
            })
            deletedMessagesCount++;
          } catch (error) {
            console.error(`Failed to delete message ${message.id}:`, error)
          }
        }
      }
      
      // Then delete all conversations for this user
      for (const conversation of conversations) {
        try {
          await db.conversation.delete({
            where: { id: conversation.id }
          })
          deletedConversationsCount++;
        } catch (error) {
          console.error(`Failed to delete conversation ${conversation.id}:`, error)
        }
      }
      
      console.log(`Deleted ${deletedMessagesCount} messages and ${deletedConversationsCount} conversations for user:`, userId)
      return NextResponse.json({ 
        success: true, 
        deletedMessages: deletedMessagesCount,
        deletedConversations: deletedConversationsCount,
        message: `Successfully deleted ${deletedConversationsCount} conversations and ${deletedMessagesCount} messages`
      })
    }
    
    // Handle create conversation (default behavior)
    console.log('Creating new conversation with title:', title, 'for user:', userId)
    const conversation = await db.conversation.create({
      data: {
        title: title || null,
        userId: userId // Associate conversation with the current user
      },
      include: {
        messages: true
      }
    })

    console.log('Created new conversation:', conversation.id, 'for user:', userId)
    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Create/delete conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}