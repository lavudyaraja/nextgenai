'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Share2, 
  Copy, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  MessageSquare, 
  Link as LinkIcon,
  Check,
  Music
} from 'lucide-react'
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

export function SocialSharing() {
  const [song, setSong] = useState<Song | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [copied, setCopied] = useState(false)

  // Mock song for demonstration
  const mockSong: Song = {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    genre: ['Pop', 'Synth-pop'],
    spotifyUrl: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3',
    youtubeUrl: 'https://youtube.com/watch?v=4NRXx6U8ABQ'
  }

  const shareToSocialMedia = async (platform: string) => {
    if (!song) {
      setSong(mockSong)
    }

    const currentSong = song || mockSong
    const message = customMessage || `Check out this amazing song: ${currentSong.title} by ${currentSong.artist}`
    const url = currentSong.spotifyUrl || currentSong.youtubeUrl || window.location.href

    try {
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`, '_blank')
          break
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, '_blank')
          break
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
          break
        case 'email':
          window.open(`mailto:?subject=${encodeURIComponent(`Check out this song: ${currentSong.title}`)}&body=${encodeURIComponent(`${message}\n\n${url}`)}`)
          break
        case 'copy':
          await navigator.clipboard.writeText(`${message}\n${url}`)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
          toast({
            title: "Copied to clipboard",
            description: "Song information copied to clipboard.",
          })
          break
        default:
          if (navigator.share) {
            await navigator.share({
              title: currentSong.title,
              text: message,
              url: url
            })
          } else {
            // Fallback to copy
            await navigator.clipboard.writeText(`${message}\n${url}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            toast({
              title: "Copied to clipboard",
              description: "Song information copied to clipboard.",
            })
          }
      }
    } catch (err) {
      console.error('Error sharing:', err)
      toast({
        title: "Sharing failed",
        description: "Failed to share. Please try again.",
        variant: "destructive",
      })
    }
  }

  const currentSong = song || mockSong

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Sharing</CardTitle>
        <CardDescription>Share your favorite songs with friends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Song selection */}
        <div className="space-y-4">
          <Label>Share a Song</Label>
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="bg-muted rounded-lg w-16 h-16 flex items-center justify-center">
              <Music className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{currentSong.title}</h4>
              <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSong(mockSong)}
            >
              Change
            </Button>
          </div>
        </div>

        {/* Custom message */}
        <div className="space-y-2">
          <Label>Custom Message</Label>
          <Textarea
            placeholder="Add a personal message..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* Sharing options */}
        <div className="space-y-4">
          <Label>Share To</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-3"
              onClick={() => shareToSocialMedia('native')}
            >
              <Share2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Share</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-3"
              onClick={() => shareToSocialMedia('twitter')}
            >
              <Twitter className="h-5 w-5 mb-1" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-3"
              onClick={() => shareToSocialMedia('facebook')}
            >
              <Facebook className="h-5 w-5 mb-1" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-3"
              onClick={() => shareToSocialMedia('linkedin')}
            >
              <Linkedin className="h-5 w-5 mb-1" />
              <span className="text-xs">LinkedIn</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-3"
              onClick={() => shareToSocialMedia('email')}
            >
              <Mail className="h-5 w-5 mb-1" />
              <span className="text-xs">Email</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-3"
              onClick={() => shareToSocialMedia('copy')}
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 mb-1 text-green-500" />
                  <span className="text-xs text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5 mb-1" />
                  <span className="text-xs">Copy Link</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Direct link sharing */}
        <div className="space-y-2">
          <Label>Share Link</Label>
          <div className="flex gap-2">
            <Input
              value={currentSong.spotifyUrl || currentSong.youtubeUrl || 'No link available'}
              readOnly
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => shareToSocialMedia('copy')}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}