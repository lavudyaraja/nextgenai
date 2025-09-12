'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Image as ImageIcon, Loader2, Wand2, AlertCircle, Info } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { FeaturesService } from '@/lib/features-service'

interface GeneratedImage {
  id: string
  prompt: string
  url: string
  timestamp: Date
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageStyle, setImageStyle] = useState('realistic')
  const [imageQuality, setImageQuality] = useState([50])
  const [error, setError] = useState<string | null>(null)

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a description for the image you want to generate.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const result = await FeaturesService.generateImage(prompt, imageStyle, imageQuality[0])
      
      const newImage: GeneratedImage = {
        id: `img-${Date.now()}`,
        prompt: result.prompt,
        url: result.imageUrl,
        timestamp: new Date(),
      }
      
      setGeneratedImage(newImage)
      
      toast({
        title: "Image generated",
        description: "Your image has been successfully generated!",
      })
    } catch (error: any) {
      console.error('Error generating image:', error)
      setError(error.message || 'Failed to generate image. Please try again.')
      
      // Provide specific guidance based on error type
      let toastDescription = error.message || "Failed to generate image. Please try again."
      
      if (error.message && error.message.includes('billing')) {
        toastDescription = "Image generation is temporarily unavailable due to billing limits. Please try again later."
      } else if (error.message && error.message.includes('content')) {
        toastDescription = "Your prompt may contain content that violates our policies. Please try a different prompt."
      } else if (error.message && error.message.includes('limit')) {
        toastDescription = "Too many requests. Please wait a moment and try again."
      }
      
      toast({
        title: "Error",
        description: toastDescription,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadImage = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage.url
    link.download = `generated-image-${generatedImage.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Image downloaded",
      description: "Your image has been downloaded successfully!",
    })
  }

  // Example prompts to help users
  const examplePrompts = [
    "A futuristic cityscape at sunset with flying cars",
    "A cozy cabin in a snowy forest with smoke coming from the chimney",
    "A vibrant underwater scene with colorful coral reefs and fish",
    "A magical forest with glowing mushrooms and fairy lights",
    "A steampunk-inspired mechanical robot drinking tea"
  ]

  const useExamplePrompt = (example: string) => {
    setPrompt(example)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Image Generator
        </CardTitle>
        <CardDescription>Generate creative images from text descriptions using DALL-E</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="prompt">Image Description</Label>
          <Textarea
            id="prompt"
            placeholder="Describe the image you want to generate... Be as detailed as possible for better results."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px]"
          />
          
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Example Prompts</Label>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(example)}
                  className="h-auto py-2 text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Style</Label>
              <Select value={imageStyle} onValueChange={setImageStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="oil-painting">Oil Painting</SelectItem>
                  <SelectItem value="watercolor">Watercolor</SelectItem>
                  <SelectItem value="pixel-art">Pixel Art</SelectItem>
                  <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quality: {imageQuality[0]}%</Label>
              <Slider
                value={imageQuality}
                onValueChange={setImageQuality}
                max={100}
                min={10}
                step={10}
              />
              <p className="text-xs text-muted-foreground">
                Higher quality (above 70%) will generate HD images but may take longer.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Preview</Label>
            <div className="border rounded-lg h-full flex items-center justify-center bg-muted">
              {isLoading ? (
                <div className="text-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Generating your image...
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This may take 10-30 seconds
                  </p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage.url} 
                  alt="Generated preview" 
                  className="w-full h-auto rounded-lg object-contain max-h-[400px]"
                />
              ) : (
                <div className="text-center p-8">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your generated image will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={generateImage} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>
          
          {generatedImage && (
            <Button 
              onClick={downloadImage}
              variant="outline"
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          )}
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Tips for Better Results</h4>
              <ul className="mt-2 text-sm text-blue-800 dark:text-blue-200 list-disc pl-5 space-y-1">
                <li>Be as descriptive as possible in your prompt</li>
                <li>Include details about colors, lighting, mood, and specific elements</li>
                <li>Avoid abstract concepts without concrete visual references</li>
                <li>Specify the artistic style you prefer</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}