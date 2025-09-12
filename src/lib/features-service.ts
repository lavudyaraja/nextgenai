// Utility service for handling feature APIs

export class FeaturesService {
  // Image generation
  static async generateImage(prompt: string, style?: string, quality?: number) {
    try {
      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, style, quality }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Error generating image:', error)
      throw error
    }
  }

  // Song search
  static async searchSongs(query: string) {
    try {
      const response = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`)

      // Even if the response isn't ok, we still want to parse it to get error details
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Error searching songs:', error)
      // Provide a more user-friendly error message
      if (error instanceof TypeError) {
        throw new Error('Network error - please check your connection')
      }
      throw error
    }
  }

  // AI suggestions
  static async generateSuggestions(userActivity: any) {
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userActivity }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Error generating suggestions:', error)
      throw error
    }
  }
}