'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Play, Search, Heart, ExternalLink, Loader2, Music } from 'lucide-react'
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

interface Artist {
  id: string
  name: string
  genres: string[]
  followers: number
  popularity: number
  imageUrl?: string
  bio?: string
  topSongs: Song[]
}

export function ArtistInfo() {
  const [searchQuery, setSearchQuery] = useState('')
  const [artist, setArtist] = useState<Artist | null>(null)
  const [likedSongs, setLikedSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load liked songs from localStorage
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

  const searchArtist = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter an artist name.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // In a real implementation, this would call an artist API
      // For demo purposes, we'll simulate fetching artist data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create mock artist data
      const mockArtist: Artist = {
        id: `artist-${Date.now()}`,
        name: searchQuery,
        genres: ['Pop', 'Rock', 'Electronic'],
        followers: Math.floor(Math.random() * 1000000),
        popularity: Math.floor(Math.random() * 100),
        imageUrl: 'https://placehold.co/300x300',
        bio: `This is a demo artist bio for ${searchQuery}. In a real application, this would contain detailed information about the artist's career, achievements, and background.`,
        topSongs: Array.from({ length: 5 }, (_, i) => ({
          id: `song-${Date.now()}-${i}`,
          title: `Popular Song ${i + 1}`,
          artist: searchQuery,
          album: `Greatest Hits ${i + 1}`,
          duration: `${Math.floor(Math.random() * 4) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          genre: ['Pop'],
          previewUrl: `https://example.com/preview-${i}.mp3`
        }))
      }
      
      setArtist(mockArtist)
    } catch (err) {
      console.error('Error fetching artist info:', err)
      setError('Failed to fetch artist information. Please try again.')
      toast({
        title: "Error",
        description: "Failed to fetch artist information. Please try again.",
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
        <CardTitle>Artist Information</CardTitle>
        <CardDescription>Discover information about your favorite artists</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Search for an artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  searchArtist()
                }
              }}
            />
            <Button 
              onClick={searchArtist} 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>

        {artist && (
          <div className="space-y-6">
            {/* Artist header */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-muted rounded-lg w-48 h-48 flex items-center justify-center">
                {artist.imageUrl ? (
                  <img 
                    src={artist.imageUrl} 
                    alt={artist.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Music className="h-24 w-24 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold">{artist.name}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {artist.genres.map((genre, index) => (
                    <Badge key={index} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-muted-foreground">
                    <span className="font-semibold">{artist.followers.toLocaleString()}</span> followers
                  </p>
                  <p className="text-muted-foreground">
                    Popularity: <span className="font-semibold">{artist.popularity}/100</span>
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-sm">{artist.bio}</p>
                </div>
              </div>
            </div>

            {/* Top songs */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Popular Songs</h3>
              <div className="space-y-3">
                {artist.topSongs.map((song) => {
                  const isLiked = likedSongs.some(likedSong => likedSong.id === song.id)
                  return (
                    <div 
                      key={song.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-muted rounded-lg w-16 h-16 flex items-center justify-center">
                          <Music className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{song.title}</h4>
                          <p className="text-sm text-muted-foreground">{song.album}</p>
                          <p className="text-xs text-muted-foreground">{song.duration}</p>
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
            </div>
          </div>
        )}

        {!artist && !isLoading && (
          <div className="text-center py-8">
            <Music className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Search for an Artist</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter an artist name to view their information and top songs
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}