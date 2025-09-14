import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const num = parseInt(searchParams.get('num') || '10')

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })

    // Perform search using GPT
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system' as const,
          content: `You are a helpful search assistant. Provide a comprehensive answer to the search query. Format your response in a clear, structured way.`
        },
        {
          role: 'user' as const,
          content: `Search query: ${query}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const searchResult = completion.choices[0]?.message?.content || 'No results found.'

    return NextResponse.json({
      results: [
        {
          title: `Search results for: ${query}`,
          content: searchResult,
          url: ''
        }
      ]
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
}