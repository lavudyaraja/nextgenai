'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Lightbulb, Image as ImageIcon, Music, Sparkles, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { FeaturesService } from '@/lib/features-service'

interface Suggestion {
  id: string
  type: 'image' | 'song'
  title: string
  description: string
  prompt?: string
  mood?: string
  relatedItem?: string
}

export function AISuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const generateSuggestions = async () => {
    setIsLoading(true)
    
    try {
      // In a real implementation, this would pass actual user activity data
      const userActivity = {
        recentImages: [],
        recentSongs: [],
        preferences: {}
      }
      
      const result = await FeaturesService.generateSuggestions(userActivity)
      setSuggestions(result.suggestions)
      
      toast({
        title: "Suggestions generated",
        description: "AI has provided personalized suggestions based on your activity.",
      })
    } catch (error) {
      console.error('Error generating suggestions:', error)
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'image') {
      toast({
        title: "Image suggestion",
        description: `Try generating: ${suggestion.prompt}`,
      })
    } else {
      toast({
        title: "Song suggestion",
        description: `Try searching for songs with a "${suggestion.mood}" mood`,
      })
    }
  }

  // Generate initial suggestions on component mount
  useEffect(() => {
    generateSuggestions()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Smart Suggestions</CardTitle>
        <CardDescription>Personalized recommendations based on your activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Smart Recommendations</AlertTitle>
          <AlertDescription>
            Our AI analyzes your generated images and searched songs to provide creative suggestions
          </AlertDescription>
        </Alert>

        {suggestions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Personalized Suggestions</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateSuggestions}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
            
            <div className="grid gap-4">
              {suggestions.map((suggestion) => (
                <div 
                  key={suggestion.id} 
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {suggestion.type === 'image' ? (
                        <ImageIcon className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Music className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{suggestion.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.type === 'image' ? 'Image Idea' : 'Song Match'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {suggestion.description}
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium">Based on:</span> {suggestion.relatedItem}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Generate Suggestions</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get AI-powered recommendations based on your creative activity
            </p>
            <Button 
              onClick={generateSuggestions} 
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Suggestions'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}