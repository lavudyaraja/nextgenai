'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Play, Plus, Trash2, Music, Edit3, Save, X } from 'lucide-react'
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

interface Playlist {
  id: string
  name: string
  songs: Song[]
  createdAt: Date
  updatedAt: Date
}

export function PlaylistManager() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  // Load playlists from localStorage on mount
  useEffect(() => {
    const storedPlaylists = localStorage.getItem('playlists')
    if (storedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(storedPlaylists)
        // Convert date strings back to Date objects
        const playlistsWithDates = parsedPlaylists.map((playlist: any) => ({
          ...playlist,
          createdAt: new Date(playlist.createdAt),
          updatedAt: new Date(playlist.updatedAt)
        }))
        setPlaylists(playlistsWithDates)
      } catch (e) {
        console.error('Failed to parse playlists from localStorage', e)
      }
    }
  }, [])

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists))
  }, [playlists])

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast({
        title: "Playlist name required",
        description: "Please enter a name for your playlist.",
        variant: "destructive",
      })
      return
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      songs: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setPlaylists(prev => [...prev, newPlaylist])
    setNewPlaylistName('')
    toast({
      title: "Playlist created",
      description: `"${newPlaylistName}" has been created.`,
    })
  }

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId))
    toast({
      title: "Playlist deleted",
      description: "Playlist has been deleted.",
    })
  }

  const startEditing = (playlist: Playlist) => {
    setEditingPlaylistId(playlist.id)
    setEditingName(playlist.name)
  }

  const saveEditing = () => {
    if (!editingName.trim()) {
      toast({
        title: "Playlist name required",
        description: "Please enter a name for your playlist.",
        variant: "destructive",
      })
      return
    }

    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === editingPlaylistId) {
        return {
          ...playlist,
          name: editingName,
          updatedAt: new Date()
        }
      }
      return playlist
    }))

    setEditingPlaylistId(null)
    setEditingName('')
    toast({
      title: "Playlist updated",
      description: "Playlist name has been updated.",
    })
  }

  const cancelEditing = () => {
    setEditingPlaylistId(null)
    setEditingName('')
  }

  const removeFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          songs: playlist.songs.filter(song => song.id !== songId),
          updatedAt: new Date()
        }
      }
      return playlist
    }))
    toast({
      title: "Song removed",
      description: "Song has been removed from playlist.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playlist Manager</CardTitle>
        <CardDescription>Create and manage your music playlists</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create new playlist */}
        <div className="space-y-4">
          <Label>Create New Playlist</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  createPlaylist()
                }
              }}
            />
            <Button onClick={createPlaylist}>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Playlists list */}
        {playlists.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Playlists ({playlists.length})</h3>
            <div className="space-y-3">
              {playlists.map((playlist) => (
                <div 
                  key={playlist.id} 
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    {editingPlaylistId === playlist.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-8"
                        />
                        <Button size="sm" onClick={saveEditing}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditing}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium">{playlist.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created {playlist.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {editingPlaylistId !== playlist.id && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startEditing(playlist)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deletePlaylist(playlist.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Playlist songs */}
                  {playlist.songs.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {playlist.songs.map((song) => (
                        <div 
                          key={song.id} 
                          className="flex items-center justify-between p-2 bg-muted/50 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-muted rounded w-10 h-10 flex items-center justify-center">
                              <Music className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{song.title}</p>
                              <p className="text-xs text-muted-foreground">{song.artist}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{song.duration}</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => removeFromPlaylist(playlist.id, song.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Music className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Playlists Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first playlist to get started
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}