'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Play, Search, Music, ExternalLink, Loader2, AlertCircle, Heart, Plus, ListMusic, Share2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { FeaturesService } from '@/lib/features-service'
import { SongPreview } from './song-preview'

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

// Add Playlist interface
interface Playlist {
  id: string
  name: string
  songs: Song[]
  createdAt: Date
  updatedAt: Date
}

export function SongSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [likedSongs, setLikedSongs] = useState<Song[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null)
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null)

  // Load liked songs and playlists from localStorage on mount
  useEffect(() => {
    const storedLikedSongs = localStorage.getItem('likedSongs')
    if (storedLikedSongs) {
      try {
        setLikedSongs(JSON.parse(storedLikedSongs))
      } catch (e) {
        console.error('Failed to parse liked songs from localStorage', e)
      }
    }
    
    const storedPlaylists = localStorage.getItem('playlists')
    if (storedPlaylists) {
      try {
        setPlaylists(JSON.parse(storedPlaylists))
      } catch (e) {
        console.error('Failed to parse playlists from localStorage', e)
      }
    }
  }, [])

  // Save liked songs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs))
  }, [likedSongs])

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists))
  }, [playlists])

  const searchSongs = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a song title, artist, or lyrics snippet to search.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setSearchResults([])
    
    try {
      console.log('Searching for songs with query:', searchQuery)
      const result = await FeaturesService.searchSongs(searchQuery)
      console.log('Received search results:', result)
      setSearchResults(result.results)
      
      if (result.results.length === 0) {
        toast({
          title: "No results found",
          description: "Try adjusting your search query.",
        })
      }
    } catch (error: any) {
      console.error('Error searching songs:', error)
      setError(error.message || 'Failed to search songs. Please try again.')
      
      toast({
        title: "Error",
        description: error.message || "Failed to search songs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openPreview = (song: Song, playlist?: Playlist, index?: number) => {
    setSelectedSong(song)
    setIsPreviewOpen(true)
    setCurrentPlaylist(playlist || null)
    setCurrentSongIndex(index !== undefined ? index : null)
  }

  const closePreview = () => {
    setIsPreviewOpen(false)
    setSelectedSong(null)
    setCurrentPlaylist(null)
    setCurrentSongIndex(null)
  }

  const playPreview = (previewUrl?: string) => {
    console.log('Attempting to play preview:', previewUrl)
    
    if (!previewUrl) {
      toast({
        title: "Preview not available",
        description: "This song doesn't have a preview available.",
        variant: "destructive",
      })
      return
    }

    // For the main search view, we'll just show a toast since the preview handles playback
    toast({
      title: "Preview available",
      description: "Click on the song to open the preview player for full controls.",
    })
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
  }

  // Playlist management functions
  const createPlaylist = (name: string, songs: Song[] = []) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songs,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setPlaylists(prev => [...prev, newPlaylist])
    toast({
      title: "Playlist created",
      description: `${name} has been created.`,
    })
    return newPlaylist
  }

  const addToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        // Check if song is already in playlist
        const isAlreadyInPlaylist = playlist.songs.some(s => s.id === song.id)
        if (isAlreadyInPlaylist) {
          toast({
            title: "Song already in playlist",
            description: `${song.title} is already in ${playlist.name}.`,
            variant: "default",
          })
          return playlist
        }
        
        const updatedPlaylist = {
          ...playlist,
          songs: [...playlist.songs, song],
          updatedAt: new Date()
        }
        
        toast({
          title: "Song added to playlist",
          description: `${song.title} has been added to ${playlist.name}.`,
        })
        return updatedPlaylist
      }
      return playlist
    }))
  }

  const removeFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        const updatedPlaylist = {
          ...playlist,
          songs: playlist.songs.filter(song => song.id !== songId),
          updatedAt: new Date()
        }
        return updatedPlaylist
      }
      return playlist
    }))
  }

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId))
    toast({
      title: "Playlist deleted",
      description: "Playlist has been deleted.",
    })
  }

  // Navigation functions for playlist
  const playNextSong = () => {
    if (currentPlaylist && currentSongIndex !== null && currentSongIndex < currentPlaylist.songs.length - 1) {
      const nextIndex = currentSongIndex + 1
      const nextSong = currentPlaylist.songs[nextIndex]
      openPreview(nextSong, currentPlaylist, nextIndex)
    }
  }

  const playPreviousSong = () => {
    if (currentPlaylist && currentSongIndex !== null && currentSongIndex > 0) {
      const prevIndex = currentSongIndex - 1
      const prevSong = currentPlaylist.songs[prevIndex]
      openPreview(prevSong, currentPlaylist, prevIndex)
    }
  }

  // Example searches to help users
  const exampleSearches = [
    "Blinding Lights",
    "The Weeknd",
    "Pop",
    "Dua Lipa",
    "Rock"
  ]

  const useExampleSearch = (example: string) => {
    setSearchQuery(example)
  }

  // Share song function
  const shareSong = (song: Song) => {
    if (navigator.share) {
      navigator.share({
        title: song.title,
        text: `Check out this song: ${song.title} by ${song.artist}`,
        url: song.spotifyUrl || window.location.href
      }).catch((error) => {
        console.log('Error sharing:', error)
        // Fallback to copy to clipboard
        copyToClipboard(song)
      })
    } else {
      // Fallback to copy to clipboard
      copyToClipboard(song)
    }
  }

  const copyToClipboard = (song: Song) => {
    const textToCopy = `${song.title} by ${song.artist}\n${song.spotifyUrl || song.youtubeUrl || 'No link available'}`
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Song information copied to clipboard.",
      })
    }).catch((error) => {
      console.error('Failed to copy:', error)
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Song Search & Discovery</CardTitle>
        <CardDescription>Find songs by title, artist, or lyrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Search for songs, artists, or lyrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  searchSongs()
                }
              }}
            />
            <Button 
              onClick={searchSongs} 
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
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Example Searches</Label>
            <div className="flex flex-wrap gap-2">
              {exampleSearches.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(example)}
                  className="h-auto py-2 text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Playlists Section */}
        {playlists.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Playlists ({playlists.length})</h3>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  const name = prompt('Enter playlist name:')
                  if (name) {
                    createPlaylist(name)
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Playlist
              </Button>
            </div>
            <div className="space-y-3">
              {playlists.map((playlist) => (
                <div 
                  key={playlist.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (playlist.songs.length > 0) {
                      openPreview(playlist.songs[0], playlist, 0)
                    } else {
                      toast({
                        title: "Empty playlist",
                        description: "This playlist is empty.",
                        variant: "default",
                      })
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-muted rounded-lg w-16 h-16 flex items-center justify-center">
                      <ListMusic className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{playlist.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated {playlist.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePlaylist(playlist.id)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liked Songs Section */}
        {likedSongs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liked Songs ({likedSongs.length})</h3>
            <div className="space-y-3">
              {likedSongs.map((song) => (
                <div 
                  key={`liked-${song.id}`} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => openPreview(song)}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-muted rounded-lg w-16 h-16 flex items-center justify-center">
                      <Music className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{song.title}</h4>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                      <p className="text-xs text-muted-foreground">{song.album} • {song.duration}</p>
                      <div className="flex gap-1 mt-1">
                        {song.genre && song.genre.map ? song.genre.map((g, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {g}
                          </Badge>
                        )) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation()
                        playPreview(song.previewUrl)
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLikeSong(song)
                      }}
                    >
                      <Heart className="h-4 w-4 fill-current text-red-500" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        shareSong(song)
                      }}
                    >
                      <Share2 className="h-4 w-4" />
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
              ))}
            </div>
          </div>
        )}

        {searchResults.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
            <div className="space-y-3">
              {searchResults.map((song) => {
                const isLiked = likedSongs.some(likedSong => likedSong.id === song.id)
                return (
                  <div 
                    key={song.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => openPreview(song)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-muted rounded-lg w-16 h-16 flex items-center justify-center">
                        <Music className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{song.title}</h4>
                        <p className="text-sm text-muted-foreground">{song.artist}</p>
                        <p className="text-xs text-muted-foreground">{song.album} • {song.duration}</p>
                        <div className="flex gap-1 mt-1">
                          {song.genre && song.genre.map ? song.genre.map((g, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {g}
                            </Badge>
                          )) : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation()
                          playPreview(song.previewUrl)
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLikeSong(song)
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Add to playlist
                          if (playlists.length > 0) {
                            const playlistId = playlists[0].id // For demo, add to first playlist
                            addToPlaylist(playlistId, song)
                          } else {
                            const name = prompt('Enter a name for your new playlist:')
                            if (name) {
                              const newPlaylist = createPlaylist(name, [song])
                              toast({
                                title: "Playlist created",
                                description: `${song.title} has been added to your new playlist "${name}".`,
                              })
                            }
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          shareSong(song)
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      {song.spotifyUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
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
        ) : !isLoading && !error ? (
          <div className="text-center py-8">
            <Music className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Search for Songs</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter a song title, artist, or lyrics snippet to discover music
            </p>
          </div>
        ) : null}
      </CardContent>

      {/* Song Preview Modal */}
      {selectedSong && (
        <SongPreview
          song={selectedSong}
          isOpen={isPreviewOpen}
          onClose={closePreview}
          onLike={toggleLikeSong}
          isLiked={likedSongs.some(likedSong => likedSong.id === selectedSong.id)}
          playlist={currentPlaylist || undefined}
          currentSongIndex={currentSongIndex || undefined}
          onNext={playNextSong}
          onPrevious={playPreviousSong}
        />
      )}
    </Card>
  )
}