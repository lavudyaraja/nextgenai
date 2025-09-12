// API service for handling conversation operations
class APIService {
  // Function to create a new conversation
  async createConversation() {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Chat' }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.statusText}`)
      }

      const conversation = await response.json()
      console.log('API Service - Created conversation:', conversation.id)
      return conversation
    } catch (error) {
      console.error('API Service - Failed to create conversation:', error)
      throw error
    }
  }

  // Function to get conversation by ID
  async getConversationById(id: string) {
    try {
      const response = await fetch(`/api/conversations/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('API Service - Conversation not found:', id)
          return null
        }
        throw new Error(`Failed to get conversation: ${response.statusText}`)
      }

      const conversation = await response.json()
      console.log('API Service - Retrieved conversation:', id)
      return conversation
    } catch (error) {
      console.error('API Service - Failed to get conversation:', error)
      throw error
    }
  }

  // Function to get all conversations
  async getAllConversations() {
    try {
      const response = await fetch('/api/conversations')
      
      if (!response.ok) {
        throw new Error(`Failed to get conversations: ${response.statusText}`)
      }

      const conversations = await response.json()
      console.log('API Service - Retrieved', conversations.length, 'conversations')
      return conversations
    } catch (error) {
      console.error('API Service - Failed to get conversations:', error)
      return []
    }
  }

  // Function to get messages by conversation ID
  async getMessagesByConversationId(conversationId: string) {
    try {
      const response = await fetch(`/api/chat?conversationId=${conversationId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('API Service - Messages not found for conversation:', conversationId)
          return null
        }
        throw new Error(`Failed to get messages: ${response.statusText}`)
      }

      const conversation = await response.json()
      console.log('API Service - Retrieved', conversation.messages.length, 'messages for conversation:', conversationId)
      return conversation.messages
    } catch (error) {
      console.error('API Service - Failed to get messages:', error)
      throw error
    }
  }
}

// Export a singleton instance
export const apiService = new APIService()