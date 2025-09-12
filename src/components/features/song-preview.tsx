'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, SkipBack, SkipForward, Volume2, ExternalLink, Heart, X } from 'lucide-react'
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

// Add Playlist interface
interface Playlist {
  id: string
  name: string
  songs: Song[]
  createdAt: Date
  updatedAt: Date
}

interface SongPreviewProps {
  song: Song
  isOpen: boolean
  onClose: () => void
  onLike?: (song: Song) => void
  isLiked?: boolean
  playlist?: Playlist
  currentSongIndex?: number
  onNext?: () => void
  onPrevious?: () => void
}

export function SongPreview({ song, isOpen, onClose, onLike, isLiked, playlist, currentSongIndex, onNext, onPrevious }: SongPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Handle audio playback
  useEffect(() => {
    if (!isOpen) {
      // Clean up when preview is closed
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
      setDuration(0)
      return
    }

    // Initialize audio when preview opens
    if (song.previewUrl) {
      // Only create a new audio element if one doesn't exist or the song has changed
      if (!audioRef.current) {
        audioRef.current = new Audio(song.previewUrl)
        audioRef.current.volume = volume / 100
      }

      // Set up event listeners
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0)
      }
      
      const handleTimeUpdate = () => {
        const current = audioRef.current?.currentTime || 0
        setCurrentTime(current)
        if (duration > 0) {
          setProgress((current / duration) * 100)
        }
      }
      
      const handleEnded = () => {
        setIsPlaying(false)
        setProgress(0)
        setCurrentTime(0)
        // Auto-play next song if in playlist
        if (playlist && onNext) {
          onNext()
        }
      }
      
      const handleError = (e: any) => {
        console.error('Audio error:', e)
        toast({
          title: "Playback error",
          description: "Failed to load the song preview.",
          variant: "destructive",
        })
        setIsPlaying(false)
      }
      
      const handlePlay = () => {
        setIsPlaying(true)
      }
      
      const handlePause = () => {
        setIsPlaying(false)
      }
      
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
      audioRef.current.addEventListener('ended', handleEnded)
      audioRef.current.addEventListener('error', handleError)
      audioRef.current.addEventListener('play', handlePlay)
      audioRef.current.addEventListener('pause', handlePause)
      
      // Clean up event listeners
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
          audioRef.current.removeEventListener('ended', handleEnded)
          audioRef.current.removeEventListener('error', handleError)
          audioRef.current.removeEventListener('play', handlePlay)
          audioRef.current.removeEventListener('pause', handlePause)
        }
      }
    }

    return () => {
      // Clean up on unmount
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [isOpen, song.previewUrl, volume, playlist, onNext, duration])

  const togglePlay = async () => {
    if (!song.previewUrl) {
      toast({
        title: "Preview not available",
        description: "This song doesn't have a preview available.",
        variant: "destructive",
      })
      return
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(song.previewUrl)
      audioRef.current.volume = volume / 100
    }

    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        // If we're at the end, restart from beginning
        if (audioRef.current.currentTime === audioRef.current.duration) {
          audioRef.current.currentTime = 0
        }
        await audioRef.current.play()
      }
    } catch (error) {
      console.error('Error toggling play:', error)
      toast({
        title: "Playback error",
        description: "Failed to play/pause the song preview.",
        variant: "destructive",
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
    if (audioRef.current && duration > 0) {
      const newTime = (value / 100) * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-muted rounded-lg w-48 h-48 flex items-center justify-center">
              {song.artworkUrl ? (
                <img 
                  src={song.artworkUrl} 
                  alt={`${song.title} album cover`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              )}
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">{song.title}</CardTitle>
              <p className="text-muted-foreground">{song.artist}</p>
              <p className="text-sm text-muted-foreground">{song.album}</p>
              {playlist && (
                <p className="text-xs text-muted-foreground mt-1">
                  {currentSongIndex !== undefined ? `${currentSongIndex + 1} of ${playlist.songs.length}` : ''}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration) || song.duration}</span>
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
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onPrevious}
              disabled={!playlist || currentSongIndex === 0}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              className="rounded-full w-12 h-12"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onNext}
              disabled={!playlist || (currentSongIndex !== undefined && currentSongIndex >= (playlist?.songs.length || 0) - 1)}
            >
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

          <div className="flex flex-wrap gap-2">
            {song.genre.map((g, index) => (
              <Badge key={index} variant="secondary">
                {g}
              </Badge>
            ))}
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onLike?.(song)}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
          
          {/* Lyrics display section */}
          {song.lyrics && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Lyrics</h3>
              <div className="max-h-32 overflow-y-auto text-sm">
                {song.lyrics.split('\n').map((line, index) => (
                  <p key={index} className="mb-1">{line}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}