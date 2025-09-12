import { apiService } from './api-service'
import { simpleStorage } from './simple-storage'
import { db } from './db'

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

// Retry mechanism for database operations
const withRetry = async <T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> => {
  let lastError: any
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      console.warn(`Operation failed (attempt ${attempt}/${maxRetries}):`, error)
      
      if (attempt === maxRetries) break
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

// Function to create a new conversation with enhanced error handling
export const createNewConversation = async (title?: string): Promise<{ id: string; title?: string }> => {
  const conversationTitle = title || `Chat ${new Date().toLocaleDateString()}`
  console.log('Creating new conversation with title:', conversationTitle)
  
  try {
    // Try API service first (primary method)
    const conversation = await apiService.createConversation()
    console.log('Created conversation via API:', conversation.id)
    // Dispatch event to update sidebar
    window.dispatchEvent(new Event('chatHistoryUpdated'))
    return { id: conversation.id, title: conversationTitle }
    
  } catch (apiError) {
    console.warn('API creation failed, trying database fallback:', apiError)
    
    try {
      // Try database service as fallback
      const conversation = await withRetry(async () => {
        return await db.conversation.create({
          data: {
            title: conversationTitle,
            userId: 'default-user',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      })
      
      console.log('Created conversation via database:', conversation.id)
      // Dispatch event to update sidebar
      window.dispatchEvent(new Event('chatHistoryUpdated'))
      return { id: conversation.id, title: conversation.title || undefined }
      
    } catch (dbError) {
      console.warn('Database creation failed, using simple storage:', dbError)
      
      // Final fallback to simple storage
      const conversation = simpleStorage.createConversation({
        title: conversationTitle,
        userId: 'default-user',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      console.log('Created conversation via simple storage:', conversation.id, 'Conversation data:', conversation)
      // Dispatch event to update sidebar
      window.dispatchEvent(new Event('chatHistoryUpdated'))
      return { id: conversation.id, title: conversationTitle }
    }
  }
}

// Function to get conversation by ID with comprehensive fallback
export const getConversationById = async (id: string): Promise<ConversationWithMessages | null> => {
  if (!id) {
    throw new ConversationError('Conversation ID is required', 'NOT_FOUND')
  }

  try {
    // Try database first
    const conversation = await withRetry(async () => {
      return await db.conversation.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      })
    })

    if (conversation) {
      return {
        ...conversation,
        messages: conversation.messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role as 'user' | 'assistant',
          timestamp: new Date(msg.createdAt),
          conversationId: msg.conversationId,
          createdAt: new Date(msg.createdAt)
        }))
      }
    }

  } catch (dbError) {
    console.warn('Database query failed, trying API fallback:', dbError)
    
    try {
      // Try API service as fallback
      const conversation = await apiService.getConversationById(id)
      if (conversation) {
        return conversation
      }
    } catch (apiError) {
      console.warn('API query failed, trying simple storage:', apiError)
    }
  }

  // Try simple storage as final fallback
  try {
    const storedConversation = simpleStorage.getConversation(id)
    if (storedConversation) {
      const messages = simpleStorage.getMessages(id)
      return {
        ...storedConversation,
        messages: messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role as 'user' | 'assistant',
          timestamp: new Date(msg.createdAt || msg.timestamp),
          conversationId: id,
          createdAt: new Date(msg.createdAt || msg.timestamp)
        }))
      }
    }
  } catch (storageError) {
    console.warn('Simple storage query failed:', storageError)
  }

  return null
}

// Function to get all conversations with enhanced data
export const getAllConversations = async (): Promise<ConversationWithMessages[]> => {
  try {
    // Try database first
    const conversations = await withRetry(async () => {
      return await db.conversation.findMany({
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    })

    return conversations.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as 'user' | 'assistant',
        timestamp: new Date(msg.createdAt),
        conversationId: msg.conversationId,
        createdAt: new Date(msg.createdAt)
      }))
    }))

  } catch (dbError) {
    console.warn('Database query failed, trying API fallback:', dbError)
    
    try {
      // Try API service as fallback
      const conversations = await apiService.getAllConversations()
      return conversations || []
      
    } catch (apiError) {
      console.warn('API query failed, trying simple storage:', apiError)
      
      // Final fallback to simple storage
      const storedConversations = simpleStorage.listConversations()
      return storedConversations.map((conv: any) => {
        const messages = simpleStorage.getMessages(conv.id)
        return {
          ...conv,
          messages: messages.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            role: msg.role as 'user' | 'assistant',
            timestamp: new Date(msg.createdAt || msg.timestamp),
            conversationId: conv.id,
            createdAt: new Date(msg.createdAt || msg.timestamp)
          }))
        }
      })
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
      return conversation.messages
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

  try {
    // Try database first
    await withRetry(async () => {
      await db.conversation.delete({
        where: { id: conversationId }
      })
    })
    
    console.log('Deleted conversation via database:', conversationId)
    return true
    
  } catch (dbError) {
    console.warn('Database deletion failed, trying simple storage:', dbError)
    
    try {
      // Fallback to simple storage
      simpleStorage.deleteConversation(conversationId)
      console.log('Deleted conversation via simple storage:', conversationId)
      return true
      
    } catch (storageError) {
      console.error('Failed to delete conversation:', storageError)
      throw new ConversationError(
        'Failed to delete conversation from all storage methods',
        'DATABASE_ERROR',
        { dbError, storageError }
      )
    }
  }
}

// Function to update conversation title
export const updateConversationTitle = async (conversationId: string, title: string): Promise<boolean> => {
  if (!conversationId || !title) {
    throw new ConversationError('Conversation ID and title are required', 'NOT_FOUND')
  }

  try {
    // Try database first
    await withRetry(async () => {
      await db.conversation.update({
        where: { id: conversationId },
        data: { title, updatedAt: new Date() }
      })
    })
    
    return true
    
  } catch (dbError) {
    console.warn('Database update failed, trying simple storage:', dbError)
    
    try {
      // Fallback to simple storage
      const conversation = simpleStorage.getConversation(conversationId)
      if (conversation) {
        simpleStorage.updateConversation(conversationId, { 
          ...conversation, 
          title, 
          updatedAt: new Date() 
        })
        return true
      }
      
      throw new ConversationError('Conversation not found in simple storage', 'NOT_FOUND')
      
    } catch (storageError) {
      throw new ConversationError(
        'Failed to update conversation title',
        'DATABASE_ERROR',
        { dbError, storageError }
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