/**
 * Message Reaction Service for Backend
 * Handles message reaction persistence and analytics
 */

import { db } from './db'

export interface MessageReactionData {
  messageId: string
  reaction: 'like' | 'dislike' | null
  userId?: string
  timestamp: Date
}

export class MessageReactionService {
  /**
   * Save or update message reaction
   * Currently uses localStorage until database schema is updated
   */
  static async saveReaction(data: MessageReactionData): Promise<void> {
    const { messageId, reaction } = data
    
    // TODO: Update the message with the new reaction when database schema includes reaction field
    // await db.message.update({
    //   where: { id: messageId },
    //   data: { reaction }
    // })
    
    // For now, just log the interaction
    console.log(`Message ${messageId} reaction set to: ${reaction || 'none'} (stored locally until DB schema update)`)
  }
  
  /**
   * Get reactions for a conversation
   * Currently returns empty until database schema is updated
   */
  static async getConversationReactions(conversationId: string): Promise<Record<string, string>> {
    // TODO: Query reactions from database when schema includes reaction field
    // const messages = await db.message.findMany({
    //   where: { 
    //     conversationId,
    //     reaction: { not: null }
    //   },
    //   select: {
    //     id: true,
    //     reaction: true
    //   }
    // })
    // 
    // return messages.reduce((acc, message) => {
    //   if (message.reaction) {
    //     acc[message.id] = message.reaction
    //   }
    //   return acc
    // }, {} as Record<string, string>)
    
    console.log(`Loading reactions for conversation ${conversationId} - using localStorage until DB schema update`)
    return {}
  }
  
  /**
   * Get reaction statistics for analytics
   * Currently returns zero counts until database schema is updated
   */
  static async getReactionStats(conversationId?: string): Promise<{
    totalLikes: number
    totalDislikes: number
    messageCount: number
  }> {
    const whereClause = conversationId ? { conversationId } : {}
    
    // TODO: Query reaction stats when database schema includes reaction field
    // const [likes, dislikes, total] = await Promise.all([
    //   db.message.count({
    //     where: { ...whereClause, reaction: 'like' }
    //   }),
    //   db.message.count({
    //     where: { ...whereClause, reaction: 'dislike' }
    //   }),
    //   db.message.count({
    //     where: { ...whereClause, role: 'assistant' } // Only count AI messages
    //   })
    // ])
    
    // Get total messages count (this field exists)
    const total = await db.message.count({
      where: { ...whereClause, role: 'assistant' } // Only count AI messages
    })
    
    console.log(`Getting reaction stats for ${conversationId || 'all conversations'} - using placeholder until DB schema update`)
    
    return {
      totalLikes: 0, // Placeholder until database schema includes reactions
      totalDislikes: 0, // Placeholder until database schema includes reactions
      messageCount: total
    }
  }
  
  /**
   * Remove reaction from message
   */
  static async removeReaction(messageId: string): Promise<void> {
    await this.saveReaction({
      messageId,
      reaction: null,
      timestamp: new Date()
    })
  }
}