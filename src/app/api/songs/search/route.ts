import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Fetch from iTunes Search API
    const iTunesResponse = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=25`
    )

    if (!iTunesResponse.ok) {
      throw new Error(`iTunes API error: ${iTunesResponse.status}`)
    }

    const iTunesData = await iTunesResponse.json()

    // Transform iTunes API response to our format
    const results = iTunesData.results.map((item: any) => ({
      id: item.trackId.toString(),
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      duration: formatDuration(item.trackTimeMillis),
      genre: item.primaryGenreName ? [item.primaryGenreName] : ['Unknown'],
      previewUrl: item.previewUrl,
      spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(item.trackName)}%20${encodeURIComponent(item.artistName)}`,
      youtubeUrl: `https://youtube.com/results?search_query=${encodeURIComponent(item.trackName)}+${encodeURIComponent(item.artistName)}`,
      artworkUrl: item.artworkUrl100
    }))

    return new Response(
      JSON.stringify({ 
        success: true,
        results,
        query,
        resultCount: iTunesData.resultCount
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error searching songs:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to search songs. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Helper function to format duration from milliseconds to MM:SS
function formatDuration(milliseconds: number): string {
  if (!milliseconds) return '0:00'
  
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}