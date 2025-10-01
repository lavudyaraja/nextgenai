import { NextRequest, NextResponse } from 'next/server'
import { databaseService as db } from '@/lib/database-service'

// Helper function to safely convert dates to ISO strings
function safeToISOString(date: any): string | null {
  if (!date) return null;
  
  let dateObj: Date;
  
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string') {
    // If it's already a string, try to parse it as a date first
    dateObj = new Date(date);
  } else if (typeof date === 'number') {
    // If it's a timestamp number
    dateObj = new Date(date);
  } else {
    // Try to convert to string and then to date
    dateObj = new Date(date.toString());
  }
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return null;
  }
  
  return dateObj.toISOString();
}

// Helper function to get user ID from request (in a real app, this would validate a session/JWT)
async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  console.log('Getting user ID from request')
  
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

// GET /api/conversations - List all conversations
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/conversations called')
    
    // Get the user ID from the request
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Fetch conversations from database service (which uses simple storage)
    // Filter by userId to ensure users only see their own conversations
    const conversations = await db.conversation.findMany({
      where: {
        userId: userId
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' } // Order messages by creation time
        }
      }
    })
    console.log('Found conversations:', conversations.length)
    
    // Ensure proper serialization of dates
    const serializedConversations = conversations.map(conv => {
      // Handle potential null/undefined values
      const createdAt = conv.createdAt || new Date();
      const updatedAt = conv.updatedAt || createdAt;
      
      return {
        ...conv,
        createdAt: safeToISOString(createdAt) || createdAt,
        updatedAt: safeToISOString(updatedAt) || updatedAt,
        messages: (conv.messages || []).map(msg => {
          // Handle potential null/undefined values for messages
          const msgCreatedAt = msg.createdAt || new Date();
          // Use createdAt as fallback for updatedAt if not present
          const msgUpdatedAt = msg.updatedAt || msgCreatedAt;
          
          return {
            ...msg,
            createdAt: safeToISOString(msgCreatedAt) || msgCreatedAt,
            updatedAt: safeToISOString(msgUpdatedAt) || msgUpdatedAt,
          }
        })
      }
    })
    
    return NextResponse.json(serializedConversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch conversations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/conversations - Create a new conversation or delete all conversations
export async function POST(request: NextRequest) {
  try {
    // Get the user ID from the request
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { action } = body || {}
    
    // Handle delete all action
    if (action === 'deleteAll') {
      console.log('Deleting all conversations for user:', userId)
      
      try {
        // First get all conversations for the current user
        const conversations = await db.conversation.findMany({
          where: {
            userId: userId
          }
        })
        
        console.log(`Found ${conversations.length} conversations to delete`)
        
        let deletedConversationsCount = 0;
        
        // Delete each conversation
        for (const conversation of conversations) {
          try {
            await db.conversation.delete({
              where: { id: conversation.id }
            })
            deletedConversationsCount++;
            console.log(`Deleted conversation: ${conversation.id}`)
          } catch (error) {
            console.error(`Failed to delete conversation ${conversation.id}:`, error)
          }
        }
        
        console.log(`Deleted ${deletedConversationsCount} conversations`)
        return NextResponse.json({ 
          success: true, 
          deletedConversations: deletedConversationsCount,
          message: `Successfully deleted ${deletedConversationsCount} conversations`
        })
      } catch (error) {
        console.error('Error deleting all conversations:', error)
        return NextResponse.json(
          { 
            error: 'Failed to delete all conversations',
            message: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 500 }
        )
      }
    }
    
    // Handle create conversation (default behavior)
    const conversation = await db.conversation.create({
      data: {
        ...body,
        userId: userId // Ensure the conversation is associated with the current user
      }
    })
    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error processing conversation request:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}