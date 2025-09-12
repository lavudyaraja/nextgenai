'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, HardDrive, WifiOff, Loader2 } from 'lucide-react'
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

export function OfflinePlayback() {
  const [downloadedSongs, setDownloadedSongs] = useState<Song[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load downloaded songs from localStorage
  useEffect(() => {
    const storedDownloadedSongs = localStorage.getItem('downloadedSongs')
    if (storedDownloadedSongs) {
      try {
        setDownloadedSongs(JSON.parse(storedDownloadedSongs))
      } catch (e) {
        console.error('Failed to parse downloaded songs from localStorage', e)
      }
    }
  }, [])

  // Handle audio playback
  useEffect(() => {
    if (!currentSong) {
      // Clean up when no song is selected
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setIsPlaying(false)
      setProgress(0)
      return
    }

    // Initialize audio when song is selected
    if (currentSong.previewUrl) {
      audioRef.current = new Audio(currentSong.previewUrl)
      audioRef.current.volume = volume / 100
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false)
        setProgress(0)
      })
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e)
        toast({
          title: "Playback error",
          description: "Failed to play the downloaded song.",
          variant: "destructive",
        })
        setIsPlaying(false)
      })
    }

    return () => {
      // Clean up on unmount
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [currentSong, volume])

  const togglePlay = () => {
    if (!currentSong) {
      toast({
        title: "No song selected",
        description: "Please select a song to play.",
        variant: "destructive",
      })
      return
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(currentSong.previewUrl)
      audioRef.current.volume = volume / 100
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    } else {
      // Start progress tracking
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime || 0
          const duration = audioRef.current.duration || 1
          setProgress((currentTime / duration) * 100)
        }
      }, 1000)

      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((error) => {
          console.error('Error playing audio:', error)
          toast({
            title: "Playback error",
            description: "Failed to play the downloaded song.",
            variant: "destructive",
          })
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
          }
        })
    }
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value / 100
    }
  }

  const handleProgressChange = (value: number) => {
    setProgress(value)
    if (audioRef.current) {
      const duration = audioRef.current.duration || 1
      audioRef.current.currentTime = (value / 100) * duration
    }
  }

  const downloadSong = async (song: Song) => {
    // Check if already downloaded
    const isAlreadyDownloaded = downloadedSongs.some(s => s.id === song.id)
    if (isAlreadyDownloaded) {
      toast({
        title: "Already downloaded",
        description: "This song is already in your offline library.",
        variant: "default",
      })
      return
    }

    setIsDownloading(true)
    setDownloadProgress(0)
    
    try {
      // In a real implementation, this would download the actual audio file
      // For demo purposes, we'll simulate the download process
      
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setDownloadProgress(i)
      }
      
      // Add to downloaded songs
      const downloadedSong = {
        ...song,
        // In a real app, this would be the local file URL
        localUrl: song.previewUrl
      }
      
      setDownloadedSongs(prev => [...prev, downloadedSong])
      localStorage.setItem('downloadedSongs', JSON.stringify([...downloadedSongs, downloadedSong]))
      
      toast({
        title: "Download complete",
        description: `"${song.title}" has been added to your offline library.`,
      })
    } catch (err) {
      console.error('Error downloading song:', err)
      toast({
        title: "Download failed",
        description: "Failed to download the song. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  const deleteDownloadedSong = (songId: string) => {
    setDownloadedSongs(prev => prev.filter(song => song.id !== songId))
    localStorage.setItem('downloadedSongs', JSON.stringify(downloadedSongs.filter(song => song.id !== songId)))
    
    // If the deleted song was currently playing, stop playback
    if (currentSong && currentSong.id === songId) {
      setCurrentSong(null)
    }
    
    toast({
      title: "Song removed",
      description: "Song has been removed from your offline library.",
    })
  }

  // Mock songs for demonstration
  const mockSongs: Song[] = [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:20',
      genre: ['Pop', 'Synth-pop'],
      previewUrl: 'https://example.com/blinding-lights.mp3'
    },
    {
      id: '2',
      title: 'Save Your Tears',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:35',
      genre: ['Pop', 'Synth-pop'],
      previewUrl: 'https://example.com/save-your-tears.mp3'
    },
    {
      id: '3',
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      duration: '3:23',
      genre: ['Pop', 'Disco'],
      previewUrl: 'https://example.com/levitating.mp3'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Offline Playback</CardTitle>
        <CardDescription>Download songs for offline listening</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Download section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available for Download</h3>
          <div className="space-y-3">
            {mockSongs.map((song) => {
              const isDownloaded = downloadedSongs.some(s => s.id === song.id)
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
                    {isDownloading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">{downloadProgress}%</span>
                      </div>
                    ) : isDownloaded ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        disabled
                      >
                        <HardDrive className="h-4 w-4 mr-2" />
                        Downloaded
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => downloadSong(song)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Downloaded songs section */}
        {downloadedSongs.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Offline Library ({downloadedSongs.length})</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <WifiOff className="h-4 w-4" />
                <span>Offline Mode</span>
              </div>
            </div>
            <div className="space-y-3">
              {downloadedSongs.map((song) => (
                <div 
                  key={song.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-muted rounded-lg w-16 h-16 flex items-center justify-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    </div>
                    <div>
                      <h4 
                        className={`font-medium cursor-pointer ${currentSong?.id === song.id ? 'text-primary' : ''}`}
                        onClick={() => setCurrentSong(song)}
                      >
                        {song.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                      <p className="text-xs text-muted-foreground">{song.album} • {song.duration}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteDownloadedSong(song.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player controls */}
        {currentSong && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{currentSong.title}</h4>
                  <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setCurrentSong(null)}
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>0:00</span>
                  <span>{currentSong.duration}</span>
                </div>
                <div 
                  className="h-2 bg-muted rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const pos = (e.clientX - rect.left) / rect.width
                    handleProgressChange(pos * 100)
                  }}
                >
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Button variant="ghost" size="icon">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button 
                  size="icon" 
                  className="rounded-full w-12 h-12"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon">
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <div 
                  className="h-2 flex-1 bg-muted rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const pos = (e.clientX - rect.left) / rect.width
                    handleVolumeChange(pos * 100)
                  }}
                >
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${volume}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {downloadedSongs.length === 0 && (
          <div className="text-center py-8">
            <HardDrive className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Offline Songs</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Download songs to listen offline
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}