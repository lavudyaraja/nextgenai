import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const num = parseInt(searchParams.get('num') || '10')

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    // Initialize ZAI
    const zai = await ZAI.create()

    // Perform web search
    const searchResult = await zai.functions.invoke("web_search", {
      query,
      num
    })

    return NextResponse.json(searchResult)

  } catch (error) {
    console.error('Web search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform web search' },
      { status: 500 }
    )
  }
}