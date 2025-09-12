'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageGenerator } from '@/components/features/image-generator'
import { SongSearch } from '@/components/features/song-search'
import { AISuggestions } from '@/components/features/ai-suggestions'
import { PlaylistManager } from '@/components/features/playlist-manager'
import { MusicRecommendations } from '@/components/features/music-recommendations'
import { LyricsDisplay } from '@/components/features/lyrics-display'
import { ArtistInfo } from '@/components/features/artist-info'
import { OfflinePlayback } from '@/components/features/offline-playback'
import { SocialSharing } from '@/components/features/social-sharing'

export default function FeaturesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Features</h1>
        <p className="text-muted-foreground">Explore our AI-powered tools for creativity and discovery</p>
      </div>

      <Tabs defaultValue="image-generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="image-generator">AI Image Generator</TabsTrigger>
          <TabsTrigger value="song-search">Song Search</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
          <TabsTrigger value="artist">Artist Info</TabsTrigger>
          <TabsTrigger value="offline">Offline</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="image-generator">
          <ImageGenerator />
        </TabsContent>
        
        <TabsContent value="song-search">
          <SongSearch />
        </TabsContent>
        
        <TabsContent value="playlists">
          <PlaylistManager />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <MusicRecommendations />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <AISuggestions />
        </TabsContent>
        
        <TabsContent value="lyrics">
          <LyricsDisplay />
        </TabsContent>
        
        <TabsContent value="artist">
          <ArtistInfo />
        </TabsContent>
        
        <TabsContent value="offline">
          <OfflinePlayback />
        </TabsContent>
        
        <TabsContent value="sharing">
          <SocialSharing />
        </TabsContent>
      </Tabs>
    </div>
  )
}