import { NextRequest, NextResponse } from 'next/server'
import { databaseService as db } from '@/lib/database-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            messages: {
              some: {
                content: {
                  contains: query,
                  mode: 'insensitive'
                }
              }
            }
          }
        ]
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Search conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to search conversations' },
      { status: 500 }
    )
  }
}