import { NextRequest } from 'next/server'

// Mock suggestions for demonstration
const mockSuggestions = [
  {
    id: '1',
    type: 'song',
    title: 'Based on your image',
    description: 'Relaxing lo-fi beats to match your peaceful landscape',
    mood: 'Peaceful',
    relatedItem: 'Mountain landscape at sunset'
  },
  {
    id: '2',
    type: 'image',
    title: 'Inspired by your song',
    description: 'Generate an image of a neon-lit cityscape for "Blinding Lights"',
    prompt: 'Neon cityscape at night with rain reflections, cyberpunk style',
    relatedItem: 'Blinding Lights by The Weeknd'
  },
  {
    id: '3',
    type: 'song',
    title: 'Based on your image',
    description: 'Energetic electronic music to match your vibrant abstract art',
    mood: 'Energetic',
    relatedItem: 'Colorful abstract painting'
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userActivity } = body

    // In a real implementation, this would analyze user activity and generate personalized suggestions
    // For demo purposes, we'll return mock suggestions

    return new Response(
      JSON.stringify({ 
        success: true,
        suggestions: mockSuggestions,
        userActivity
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate suggestions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}