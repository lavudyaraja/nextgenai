// Type definitions
export interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  messageCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  conversationId?: string
  liked?: boolean
  disliked?: boolean
  createdAt?: Date
}

export interface ConversationWithMessages {
  id: string
  title: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
  messages: Message[]
}

// Enhanced error handling with specific error types
export class ConversationError extends Error {
  constructor(
    message: string,
    public code: 'NOT_FOUND' | 'CREATION_FAILED' | 'DATABASE_ERROR' | 'API_ERROR',
    public originalError?: any
  ) {
    super(message)
    this.name = 'ConversationError'
  }
}

// Function to create a new conversation with enhanced error handling
export const createNewConversation = async (title?: string): Promise<{ id: string; title?: string }> => {
  const conversationTitle = title || `Chat ${new Date().toLocaleDateString()}`
  console.log('Creating new conversation with title:', conversationTitle)
  
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined'
  
  if (isBrowser) {
    // Use API call in browser environment
    try {
      // Get user ID from localStorage (in a real app, you might want to use a more secure method)
      let userId = 'default-user'
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          userId = user.id || 'default-user'
        }
      } catch (e) {
        console.error('Failed to parse user data', e)
      }
      
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({
          title: conversationTitle,
          userId: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const conversation = await response.json()
      console.log('Created conversation via API:', conversation.id)
      // Dispatch event to update sidebar
      window.dispatchEvent(new Event('chatHistoryUpdated'))
      return { id: conversation.id, title: conversation.title || undefined }
    } catch (error) {
      console.error('Failed to create conversation via API:', error)
      throw new ConversationError(
        'Failed to create conversation',
        'API_ERROR',
        error
      )
    }
  } else {
    // Use direct database access in server environment
    const { db } = await import('./db')  // Dynamic import to avoid bundling in browser
    
    try {
      // Get user ID from environment or use default
      const userId = process.env.DEFAULT_USER_ID || 'default-user'
      
      const conversation = await db.conversation.create({
        data: {
          title: conversationTitle,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      console.log('Created conversation via database:', conversation.id)
      return { id: conversation.id, title: conversation.title || undefined }
    } catch (error) {
      console.error('Failed to create conversation:', error)
      throw new ConversationError(
        'Failed to create conversation',
        'DATABASE_ERROR',
        error
      )
    }
  }
}

// Function to get conversation by ID
export const getConversationById = async (id: string): Promise<ConversationWithMessages | null> => {
  if (!id) {
    throw new ConversationError('Conversation ID is required', 'NOT_FOUND')
  }

  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined'
  
  if (isBrowser) {
    // Use API call in browser environment
    try {
      const response = await fetch(`/api/conversations/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const conversation = await response.json()
      return {
        id: conversation.id,
        title: conversation.title || null,
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt),
        userId: conversation.userId,
        messages: (conversation.messages || []).map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role as 'user' | 'assistant',
          timestamp: new Date(msg.createdAt),
          conversationId: msg.conversationId || conversation.id,
          createdAt: new Date(msg.createdAt)
        }))
      }
    } catch (error) {
      console.error('Failed to get conversation via API:', error)
      throw new ConversationError(
        'Failed to get conversation',
        'API_ERROR',
        error
      )
    }
  } else {
    // Use direct database access in server environment
    const { db } = await import('./db')  // Dynamic import to avoid bundling in browser
    
    try {
      const conversation = await db.conversation.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      })

      if (conversation) {
        return {
          id: conversation.id,
          title: conversation.title || null,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          userId: conversation.userId,
          messages: conversation.messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            role: msg.role as 'user' | 'assistant',
            timestamp: new Date(msg.createdAt),
            conversationId: msg.conversationId || conversation.id,
            createdAt: new Date(msg.createdAt)
          }))
        }
      }

      return null
    } catch (error) {
      console.error('Failed to get conversation:', error)
      throw new ConversationError(
        'Failed to get conversation',
        'DATABASE_ERROR',
        error
      )
    }
  }
}

// Function to get all conversations with enhanced data
export const getAllConversations = async (): Promise<ConversationWithMessages[]> => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined'
  
  if (isBrowser) {
    // Use API call in browser environment
    try {
      // Get user ID from localStorage (in a real app, you might want to use a more secure method)
      let userId = 'default-user'
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          userId = user.id || 'default-user'
        }
      } catch (e) {
        console.error('Failed to parse user data', e)
      }
      
      const response = await fetch('/api/conversations', {
        headers: {
          'x-user-id': userId
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const conversations = await response.json()
      return conversations.map((conv: any) => ({
        id: conv.id,
        title: conv.title || null,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        userId: conv.userId,
        messages: (conv.messages || []).map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role as 'user' | 'assistant',
          timestamp: new Date(msg.createdAt),
          conversationId: msg.conversationId || conv.id,
          createdAt: new Date(msg.createdAt)
        }))
      }))
    } catch (error) {
      console.error('Failed to get conversations via API:', error)
      throw new ConversationError(
        'Failed to get conversations',
        'API_ERROR',
        error
      )
    }
  } else {
    // Use direct database access in server environment
    const { db } = await import('./db')  // Dynamic import to avoid bundling in browser
    
    try {
      const conversations = await db.conversation.findMany({
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })

      return conversations.map(conv => ({
        id: conv.id,
        title: conv.title || null,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        userId: conv.userId,
        messages: conv.messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role as 'user' | 'assistant',
          timestamp: new Date(msg.createdAt),
          conversationId: msg.conversationId || conv.id,
          createdAt: new Date(msg.createdAt)
        }))
      }))
    } catch (error) {
      console.error('Failed to get conversations:', error)
      throw new ConversationError(
        'Failed to get conversations',
        'DATABASE_ERROR',
        error
      )
    }
  }
}

// Function to get messages by conversation ID with better error handling
export const getMessagesByConversationId = async (conversationId: string): Promise<Message[]> => {
  if (!conversationId) {
    return getWelcomeMessage()
  }

  try {
    const conversation = await getConversationById(conversationId)
    
    if (conversation && conversation.messages.length > 0) {
      // Ensure all messages have proper IDs and timestamps
      return conversation.messages.map(msg => ({
        ...msg,
        id: msg.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: msg.timestamp || new Date()
      }))
    }
    
    // Return welcome message for empty or new conversations
    return getWelcomeMessage()
  } catch (error) {
    console.error('Failed to get messages for conversation:', conversationId, error)
    return getWelcomeMessage()
  }
}

// Function to delete a conversation
export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  if (!conversationId) {
    throw new ConversationError('Conversation ID is required', 'NOT_FOUND')
  }

  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined'
  
  if (isBrowser) {
    // Use API call in browser environment
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      console.log('Deleted conversation via API:', conversationId)
      return true
    } catch (error) {
      console.error('Failed to delete conversation via API:', error)
      throw new ConversationError(
        'Failed to delete conversation',
        'API_ERROR',
        error
      )
    }
  } else {
    // Use direct database access in server environment
    const { db } = await import('./db')  // Dynamic import to avoid bundling in browser
    
    try {
      await db.conversation.delete({
        where: { id: conversationId }
      })
      
      console.log('Deleted conversation via database:', conversationId)
      return true
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      throw new ConversationError(
        'Failed to delete conversation',
        'DATABASE_ERROR',
        error
      )
    }
  }
}

// Function to update conversation title
export const updateConversationTitle = async (conversationId: string, title: string): Promise<boolean> => {
  if (!conversationId || !title) {
    throw new ConversationError('Conversation ID and title are required', 'NOT_FOUND')
  }

  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined'
  
  if (isBrowser) {
    // Use API call in browser environment
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return true
    } catch (error) {
      console.error('Failed to update conversation title via API:', error)
      throw new ConversationError(
        'Failed to update conversation title',
        'API_ERROR',
        error
      )
    }
  } else {
    // Use direct database access in server environment
    const { db } = await import('./db')  // Dynamic import to avoid bundling in browser
    
    try {
      await db.conversation.update({
        where: { id: conversationId },
        data: { title, updatedAt: new Date() }
      })
      
      return true
    } catch (error) {
      console.error('Failed to update conversation title:', error)
      throw new ConversationError(
        'Failed to update conversation title',
        'DATABASE_ERROR',
        error
      )
    }
  }
}

// Helper function to generate welcome message
const getWelcomeMessage = (): Message[] => {
  return [
    {
      id: 'welcome-1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
      createdAt: new Date()
    }
  ]
}

// Enhanced time formatting functions
export const formatTime = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date'
  }

  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffInHours < 168) { // 7 days
    return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
  } else if (diffInHours < 8760) { // 1 year
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  } else {
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })
  }
}

export const formatRelativeTime = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Unknown'
  }

  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) {
    return 'Just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }
}

// Function to get conversation statistics
export const getConversationStats = async (): Promise<{
  totalConversations: number
  totalMessages: number
  averageMessagesPerConversation: number
  mostActiveConversation?: { id: string; title: string; messageCount: number }
}> => {
  try {
    const conversations = await getAllConversations()
    const totalConversations = conversations.length
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0)
    const averageMessagesPerConversation = totalConversations > 0 ? totalMessages / totalConversations : 0
    
    let mostActiveConversation
    if (conversations.length > 0) {
      const sorted = conversations.sort((a, b) => b.messages.length - a.messages.length)
      const mostActive = sorted[0]
      mostActiveConversation = {
        id: mostActive.id,
        title: mostActive.title || 'Untitled',
        messageCount: mostActive.messages.length
      }
    }

    return {
      totalConversations,
      totalMessages,
      averageMessagesPerConversation: Math.round(averageMessagesPerConversation * 10) / 10,
      mostActiveConversation
    }
  } catch (error) {
    console.error('Failed to get conversation stats:', error)
    return {
      totalConversations: 0,
      totalMessages: 0,
      averageMessagesPerConversation: 0
    }
  }
}