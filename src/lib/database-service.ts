import { db } from './db'  // Use the real Prisma client

// Type definitions
export type Message = {
  id: string
  conversationId: string
  content: string
  role: 'user' | 'assistant'
  createdAt: Date
  updatedAt: Date
  imageUrl?: string | null
}

export type Conversation = {
  id: string
  title?: string | null
  userId: string
  isPinned?: boolean
  isArchived?: boolean
  createdAt: Date
  updatedAt: Date
}

export type ConversationWithMessages = Conversation & {
  messages: Message[]
}

// Database service that uses the real Prisma client
class DatabaseService {
  constructor() {
    console.log('DatabaseService: Initializing database service')
  }
  
  conversation = {
    create: async (data: any): Promise<Conversation> => {
      try {
        console.log('DatabaseService: Creating conversation with data:', data)
        const result = await db.conversation.create(data)
        console.log('DatabaseService: Created conversation via Prisma:', result.id)
        return result
      } catch (error) {
        console.error('DatabaseService: Failed to create conversation:', error)
        throw error
      }
    },

    findUnique: async (data: any): Promise<ConversationWithMessages | null> => {
      try {
        // Ensure messages are included in the query
        const queryData = {
          ...data,
          include: {
            ...(data.include || {}),
            messages: data.include?.messages !== undefined ? data.include.messages : true
          }
        };
        
        const result = await db.conversation.findUnique(queryData)
        if (result) {
          console.log('DatabaseService: Found conversation:', result.id)
        } else {
          console.log('DatabaseService: Conversation not found:', data.where.id)
        }
        return result as ConversationWithMessages | null
      } catch (error) {
        console.error('DatabaseService: Error finding conversation:', error)
        return null
      }
    },

    update: async (data: any): Promise<Conversation | null> => {
      try {
        // Ensure updatedAt is set to current time
        const updateData = {
          ...data,
          data: {
            ...data.data,
            updatedAt: new Date()
          }
        };
        
        const result = await db.conversation.update(updateData)
        if (result) {
          console.log('DatabaseService: Updated conversation:', result.id)
        }
        return result
      } catch (error) {
        console.error('DatabaseService: Failed to update conversation:', error)
        throw error
      }
    },

    delete: async (data: any): Promise<boolean> => {
      try {
        console.log('DatabaseService: Attempting to delete conversation with data:', data)
        const result = await db.conversation.delete(data)
        console.log('DatabaseService: Deleted conversation:', data.where.id)
        return true
      } catch (error) {
        console.error('DatabaseService: Failed to delete conversation with data:', data)
        console.error('DatabaseService: Error details:', error)
        throw error
      }
    },

    findMany: async (data: any = {}): Promise<ConversationWithMessages[]> => {
      try {
        console.log('DatabaseService: Finding many conversations with options:', data)
        // Ensure messages are always included in the query for this method
        const queryData = {
          ...data,
          include: {
            ...(data.include || {}),
            messages: true
          }
        };
        
        const result: any[] = await db.conversation.findMany(queryData)
        console.log('DatabaseService: Retrieved', result.length, 'conversations from database')
        // Ensure messages array exists for all conversations and handle date serialization
        return result.map(conv => ({
          ...conv,
          createdAt: conv.createdAt instanceof Date ? conv.createdAt : new Date(conv.createdAt),
          updatedAt: conv.updatedAt instanceof Date ? conv.updatedAt : new Date(conv.updatedAt),
          messages: (conv.messages || []).map(msg => ({
            ...msg,
            createdAt: msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt),
            updatedAt: msg.updatedAt instanceof Date ? msg.updatedAt : new Date(msg.updatedAt),
            role: msg.role as 'user' | 'assistant'
          }))
        } as ConversationWithMessages))
      } catch (error) {
        console.error('DatabaseService - Failed to find conversations:', error)
        return []
      }
    },

    // Add count method to mimic Prisma conversation.count
    count: async (data: any = {}): Promise<number> => {
      try {
        const result = await db.conversation.count(data)
        return result
      } catch (error) {
        console.error('DatabaseService - Failed to count conversations:', error)
        return 0
      }
    },
  };

  message = {
    create: async (data: any): Promise<Message> => {
      try {
        const result: any = await db.message.create(data)
        console.log('DatabaseService: Created message:', result.id)
        // Ensure updatedAt field is present (use createdAt if updatedAt doesn't exist in DB)
        // Also ensure role is properly typed
        return {
          ...result,
          role: result.role as 'user' | 'assistant',
          updatedAt: result.updatedAt || result.createdAt
        } as Message
      } catch (error) {
        console.error('DatabaseService: Failed to create message:', error)
        throw error
      }
    },

    findUnique: async (data: any): Promise<Message | null> => {
      try {
        const result: any = await db.message.findUnique(data)
        // Ensure updatedAt field is present
        if (result) {
          return {
            ...result,
            role: result.role as 'user' | 'assistant',
            updatedAt: result.updatedAt || result.createdAt
          } as Message
        }
        return result
      } catch (error) {
        console.error('DatabaseService: Failed to find message:', error)
        return null
      }
    },

    findMany: async (data: any): Promise<Message[]> => {
      try {
        const result: any[] = await db.message.findMany(data)
        // Ensure updatedAt field is present for all messages (use createdAt if updatedAt doesn't exist in DB)
        // Also ensure role is properly typed and handle date serialization
        return result.map(msg => ({
          ...msg,
          createdAt: msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt),
          updatedAt: msg.updatedAt instanceof Date ? msg.updatedAt : (msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt)),
          role: msg.role as 'user' | 'assistant'
        } as Message))
      } catch (error) {
        console.error('DatabaseService: Failed to find messages:', error)
        return []
      }
    },

    update: async (data: any): Promise<Message> => {
      try {
        const result: any = await db.message.update(data)
        // Ensure updatedAt field is present (use current time if updatedAt doesn't exist in DB)
        // Also ensure role is properly typed
        return {
          ...result,
          role: result.role as 'user' | 'assistant',
          updatedAt: result.updatedAt || new Date()
        } as Message
      } catch (error) {
        console.error('DatabaseService: Failed to update message:', error)
        throw error
      }
    },

    delete: async (data: any): Promise<boolean> => {
      try {
        await db.message.delete(data)
        return true
      } catch (error) {
        console.error('DatabaseService: Failed to delete message:', error)
        throw error
      }
    },

    // Add count method to mimic Prisma message.count
    count: async (data: any = {}): Promise<number> => {
      try {
        const result = await db.message.count(data)
        return result
      } catch (error) {
        console.error('DatabaseService - Failed to count messages:', error)
        return 0
      }
    },
  };

  // Add the missing getConversations method
  async getConversations(): Promise<ConversationWithMessages[]> {
    try {
      console.log('DatabaseService: Getting conversations...')
      // Use the existing findMany method which properly handles messages
      const conversations = await this.conversation.findMany({
        include: {
          messages: true
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })
      
      console.log('DatabaseService: Retrieved', conversations.length, 'conversations with messages')
      
      // Ensure proper date conversion and structure
      const processedConversations = conversations.map(conv => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: (conv.messages || []).map(msg => ({
          ...msg,
          timestamp: new Date(msg.createdAt),
          createdAt: new Date(msg.createdAt)
        }))
      }))

      console.log('DatabaseService: Returning', processedConversations.length, 'processed conversations')
      return processedConversations
    } catch (error) {
      console.error('DatabaseService - Failed to get conversations:', error)
      return []
    }
  }

  // Add the missing createConversation method
  async createConversation(title?: string, userId?: string): Promise<string> {
    try {
      // Validate that we have a user ID
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required to create a conversation')
      }
      
      const newConversation = await db.conversation.create({
        data: {
          title: title || 'New Chat',
          userId: userId, // Use the provided user ID
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      console.log('DatabaseService: Created conversation with ID:', newConversation.id, 'for user:', userId)
      return newConversation.id
    } catch (error) {
      console.error('DatabaseService - Failed to create conversation:', error)
      throw error
    }
  }

  $transaction = async (operations: any[]) => {
    // Use Prisma's transaction functionality
    return await db.$transaction(operations)
  }

  $connect = async () => {
    // Connect to the database
    console.log('DatabaseService: Connecting to database')
    return await db.$connect()
  }

  $disconnect = async () => {
    // Disconnect from the database
    console.log('DatabaseService: Disconnecting from database')
    return await db.$disconnect()
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService()

// Also export the class itself for direct instantiation if needed
export { DatabaseService }