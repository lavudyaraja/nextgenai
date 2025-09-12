import { NextResponse } from 'next/server'
import { databaseService as db } from '@/lib/database-service'

export async function GET() {
  try {
    const totalConversations = await db.conversation.count({})
    const pinnedConversations = await db.conversation.count({
      where: { isPinned: true }
    })
    const archivedConversations = await db.conversation.count({
      where: { isArchived: true }
    })
    const totalMessages = await db.message.count({})

    return NextResponse.json({
      totalConversations,
      pinnedConversations,
      archivedConversations,
      totalMessages
    })
  } catch (error) {
    console.error('Get conversation stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation stats' },
      { status: 500 }
    )
  }
}