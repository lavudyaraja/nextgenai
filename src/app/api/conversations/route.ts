import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // For now, return empty array
    // In a real app, you would fetch from database
    return NextResponse.json([])
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
    const { title } = await request.json()

    // For now, return empty conversation
    // In a real app, you would create in database
    return NextResponse.json({
      id: 'temp-' + Date.now(),
      title: title || null,
      messages: [],
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}