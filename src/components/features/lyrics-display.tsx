'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Music, Loader2, Save, Edit3, Check } from 'lucide-react'
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

export function LyricsDisplay() {
  const [searchQuery, setSearchQuery] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved lyrics from localStorage
  useEffect(() => {
    const savedLyrics = localStorage.getItem('savedLyrics')
    if (savedLyrics) {
      try {
        // In a real app, this would be more sophisticated
        console.log('Loaded saved lyrics')
      } catch (e) {
        console.error('Failed to parse saved lyrics', e)
      }
    }
  }, [])

  const searchLyrics = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a song title and artist.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // In a real implementation, this would call a lyrics API
      // For demo purposes, we'll simulate fetching lyrics
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Parse query to extract song and artist
      const queryParts = searchQuery.split(' by ')
      const songTitle = queryParts[0] || searchQuery
      const artistName = queryParts[1] || 'Unknown Artist'
      
      // Create mock lyrics
      const mockLyrics = `Lyrics for "${songTitle}" by ${artistName}\n\n`
        + `[Verse 1]\n`
        + `This is a demo of the lyrics display feature\n`
        + `In a real application, these would be actual lyrics\n`
        + `Fetched from a lyrics database API\n\n`
        + `[Chorus]\n`
        + `Music brings us together\n`
        + `Through every song we hear\n`
        + `Lyrics tell the stories\n`
        + `That we hold so dear\n\n`
        + `[Verse 2]\n`
        + `With each word and every line\n`
        + `Emotions start to flow\n`
        + `The power of music\n`
        + `Is something we all know`
      
      setLyrics(mockLyrics)
      setCurrentSong({
        id: `lyrics-${Date.now()}`,
        title: songTitle,
        artist: artistName,
        album: 'Unknown Album',
        duration: '0:00',
        genre: ['Unknown'],
        lyrics: mockLyrics
      })
    } catch (err) {
      console.error('Error fetching lyrics:', err)
      setError('Failed to fetch lyrics. Please try again.')
      toast({
        title: "Error",
        description: "Failed to fetch lyrics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveLyrics = () => {
    if (!currentSong || !lyrics.trim()) {
      toast({
        title: "Nothing to save",
        description: "Please search for lyrics first.",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, this would save to a database
      const savedLyrics = localStorage.getItem('savedLyrics') || '{}'
      const parsedLyrics = JSON.parse(savedLyrics)
      parsedLyrics[currentSong.id] = lyrics
      localStorage.setItem('savedLyrics', JSON.stringify(parsedLyrics))
      
      setIsEditing(false)
      toast({
        title: "Lyrics saved",
        description: "Your lyrics have been saved.",
      })
    } catch (err) {
      console.error('Error saving lyrics:', err)
      toast({
        title: "Error",
        description: "Failed to save lyrics.",
        variant: "destructive",
      })
    }
  }

  const editLyrics = () => {
    setIsEditing(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lyrics Display</CardTitle>
        <CardDescription>Search and view song lyrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Search for lyrics (e.g. 'Bohemian Rhapsody by Queen')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  searchLyrics()
                }
              }}
            />
            <Button 
              onClick={searchLyrics} 
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

        {currentSong && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{currentSong.title}</h3>
                <p className="text-muted-foreground">{currentSong.artist}</p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={saveLyrics}>
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={editLyrics}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <Textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
            ) : (
              <Card className="p-4">
                <div className="whitespace-pre-wrap text-sm">
                  {lyrics || 'No lyrics available.'}
                </div>
              </Card>
            )}
          </div>
        )}

        {!currentSong && !isLoading && (
          <div className="text-center py-8">
            <Music className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Search for Lyrics</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter a song title and artist to find lyrics
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}