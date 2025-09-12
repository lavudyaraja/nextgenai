'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Heart, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  previewUrl?: string
  spotifyUrl?: string
  youtubeUrl?: string
  genre: string[]
  artworkUrl?: string
  lyrics?: string
  artistId?: string
}

export function MusicRecommendations() {
  const [recommendations, setRecommendations] = useState<Song[]>([])
  const [likedSongs, setLikedSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load liked songs from localStorage on mount
  useEffect(() => {
    const storedLikedSongs = localStorage.getItem('likedSongs')
    if (storedLikedSongs) {
      try {
        setLikedSongs(JSON.parse(storedLikedSongs))
      } catch (e) {
        console.error('Failed to parse liked songs from localStorage', e)
      }
    }
  }, [])

  // Generate recommendations based on liked songs
  useEffect(() => {
    generateRecommendations()
  }, [likedSongs])

  const generateRecommendations = async () => {
    if (likedSongs.length === 0) {
      setRecommendations([])
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // In a real implementation, this would call an AI recommendation API
      // For demo purposes, we'll simulate recommendations based on liked songs
      
      // Get genres from liked songs
      const allGenres = likedSongs.flatMap(song => song.genre)
      const uniqueGenres = [...new Set(allGenres)]
      
      // Simulate fetching recommendations from an API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create mock recommendations based on genres
      const mockRecommendations: Song[] = []
      
      for (let i = 0; i < 10; i++) {
        const randomGenre = uniqueGenres[Math.floor(Math.random() * uniqueGenres.length)] || 'Pop'
        const mockSong: Song = {
          id: `rec-${Date.now()}-${i}`,
          title: `Recommended Song ${i + 1}`,
          artist: `Artist ${String.fromCharCode(65 + (i % 26))}`,
          album: `Album ${String.fromCharCode(65 + (i % 26))}`,
          duration: `${Math.floor(Math.random() * 4) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          genre: [randomGenre],
          previewUrl: `https://example.com/preview-${i}.mp3`
        }
        mockRecommendations.push(mockSong)
      }
      
      setRecommendations(mockRecommendations)
    } catch (err) {
      console.error('Error generating recommendations:', err)
      setError('Failed to generate recommendations. Please try again.')
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLikeSong = (song: Song) => {
    const isLiked = likedSongs.some(likedSong => likedSong.id === song.id)
    
    if (isLiked) {
      // Remove from liked songs
      setLikedSongs(prev => prev.filter(likedSong => likedSong.id !== song.id))
      toast({
        title: "Removed from liked songs",
        description: `${song.title} has been removed from your liked songs.`,
      })
    } else {
      // Add to liked songs
      setLikedSongs(prev => [...prev, song])
      toast({
        title: "Added to liked songs",
        description: `${song.title} has been added to your liked songs.`,
      })
    }
    
    // Save to localStorage
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs))
  }

  const playPreview = (previewUrl?: string) => {
    if (!previewUrl) {
      toast({
        title: "Preview not available",
        description: "This song doesn't have a preview available.",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, this would play the audio
    toast({
      title: "Playing preview",
      description: "In a real implementation, this would play the song preview.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Music Recommendations</CardTitle>
        <CardDescription>Discover new music based on your preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {likedSongs.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Liked Songs Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Like some songs to get personalized recommendations
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recommended for You</h3>
              <Button 
                variant="outline" 
                onClick={generateRecommendations}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Refresh Recommendations
              </Button>
            </div>
            
            {error && (
              <div className="text-center py-4 text-red-500">
                {error}
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((song) => {
                  const isLiked = likedSongs.some(likedSong => likedSong.id === song.id)
                  return (
                    <div 
                      key={song.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-muted rounded-lg w-16 h-16 flex items-center justify-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        </div>
                        <div>
                          <h4 className="font-medium">{song.title}</h4>
                          <p className="text-sm text-muted-foreground">{song.artist}</p>
                          <p className="text-xs text-muted-foreground">{song.album} • {song.duration}</p>
                          <div className="flex gap-1 mt-1">
                            {song.genre.map((g, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {g}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => playPreview(song.previewUrl)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => toggleLikeSong(song)}
                        >
                          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                        </Button>
                        {song.spotifyUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Recommendations</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try liking more songs to get better recommendations
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}