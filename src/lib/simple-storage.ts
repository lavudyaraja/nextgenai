// Simple in-memory storage for development/testing purposes
class SimpleStorage {
  private conversations: Map<string, any> = new Map()
  private messages: Map<string, any[]> = new Map()

  // Conversation methods
  createConversation(data: any) {
    const id = 'conv-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    const now = new Date()
    const conversation = {
      id,
      title: data.title || null,
      userId: data.userId || 'default-user',
      isPinned: data.isPinned || false,
      isArchived: data.isArchived || false,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
      ...data
    }
    this.conversations.set(id, conversation)
    this.messages.set(id, [])
    console.log('SimpleStorage: Created conversation', id, 'Total conversations:', this.conversations.size)
    return conversation
  }

  getConversation(id: string) {
    const conversation = this.conversations.get(id) || null
    console.log('SimpleStorage: Looking for conversation', id, 'Found:', !!conversation)
    return conversation
  }

  updateConversation(id: string, data: any) {
    const conversation = this.conversations.get(id)
    if (conversation) {
      const now = new Date()
      const updated = { 
        ...conversation, 
        ...data, 
        updatedAt: data.updatedAt || now 
      }
      this.conversations.set(id, updated)
      console.log('SimpleStorage: Updated conversation', id)
      return updated
    }
    console.log('SimpleStorage: Could not update conversation', id, '- not found')
    return null
  }

  deleteConversation(id: string) {
    const deleted = this.conversations.delete(id)
    this.messages.delete(id)
    console.log('SimpleStorage: Deleted conversation', id, 'Success:', deleted, 'Total conversations:', this.conversations.size)
    return deleted
  }

  listConversations() {
    const conversations = Array.from(this.conversations.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    console.log('SimpleStorage: Listing', conversations.length, 'conversations')
    return conversations
  }

  // Add the missing getAllConversations method
  getAllConversations() {
    const conversations = Array.from(this.conversations.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    console.log('SimpleStorage: Getting all conversations, count:', conversations.length)
    return conversations
  }

  // Message methods
  createMessage(data: any) {
    const { conversationId, ...messageData } = data
    const id = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    const now = new Date()
    const message = {
      id,
      conversationId,
      role: messageData.role || 'user',
      content: messageData.content || '',
      createdAt: messageData.createdAt || now,
      updatedAt: messageData.updatedAt || now,
      ...messageData
    }
    
    if (!this.messages.has(conversationId)) {
      this.messages.set(conversationId, [])
    }
    
    const conversationMessages = this.messages.get(conversationId) || []
    conversationMessages.push(message)
    this.messages.set(conversationId, conversationMessages)
    
    // Update conversation's updatedAt timestamp
    const conversation = this.conversations.get(conversationId)
    if (conversation) {
      this.updateConversation(conversationId, { updatedAt: now })
    }
    
    console.log('SimpleStorage: Created message', id, 'for conversation', conversationId, 'Total messages for this conversation:', conversationMessages.length)
    return message
  }

  getMessages(conversationId: string) {
    const messages = this.messages.get(conversationId) || []
    console.log('SimpleStorage: Getting messages for conversation', conversationId, 'Count:', messages.length)
    return messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  // Add method to find a message by ID
  getMessageById(messageId: string) {
    // Search through all conversations for the message with the given ID
    for (const [conversationId, messages] of this.messages.entries()) {
      const message = messages.find(msg => msg.id === messageId)
      if (message) {
        return message
      }
    }
    return null
  }

  // Get conversation with messages included
  getConversationWithMessages(conversationId: string) {
    const conversation = this.getConversation(conversationId)
    if (!conversation) return null

    const messages = this.getMessages(conversationId)
    return {
      ...conversation,
      messages
    }
  }

  // Get all conversations with messages
  getAllConversationsWithMessages() {
    const conversations = this.getAllConversations()
    return conversations.map(conv => ({
      ...conv,
      messages: this.getMessages(conv.id)
    }))
  }

  // Clear all data (useful for testing)
  clear() {
    this.conversations.clear()
    this.messages.clear()
    console.log('SimpleStorage: Cleared all data')
  }
  
  // Method to get the current state for debugging
  getDebugInfo() {
    return {
      conversationCount: this.conversations.size,
      conversations: Array.from(this.conversations.values()),
      messageCounts: Array.from(this.messages.entries()).map(([id, msgs]) => ({ conversationId: id, messageCount: msgs.length })),
      allMessages: Array.from(this.messages.entries())
    }
  }
}

// Ensure true singleton behavior across module reloads
const globalForSimpleStorage = globalThis as unknown as {
  simpleStorage: SimpleStorage | undefined
}

export const simpleStorage = globalForSimpleStorage.simpleStorage ?? new SimpleStorage()

if (process.env.NODE_ENV !== 'production') {
  globalForSimpleStorage.simpleStorage = simpleStorage
}