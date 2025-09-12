'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, FileText, MessageCircle, Calendar, User } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  type: 'message' | 'document' | 'event' | 'contact'
  content: string
  timestamp: Date
  conversationId?: string
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    
    // Simulate API call delay
    setTimeout(() => {
      // Sample search results
      const results: SearchResult[] = [
        {
          id: '1',
          title: 'Project Discussion',
          type: 'message',
          content: `We need to review the project timeline and make sure we're on track for the Q3 release. ${searchTerm} is a critical component.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          id: '2',
          title: 'Team Meeting Notes',
          type: 'document',
          content: `Action items from today's meeting: 1. Review ${searchTerm} implementation 2. Schedule follow-up meeting 3. Update documentation`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
        },
        {
          id: '3',
          title: 'API Integration Help',
          type: 'message',
          content: `I'm having trouble with the ${searchTerm} API integration. The authentication flow isn't working as expected.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
        },
        {
          id: '4',
          title: 'Q3 Roadmap',
          type: 'document',
          content: `Q3 roadmap includes: 1. ${searchTerm} feature development 2. Performance optimization 3. User experience improvements`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
        },
        {
          id: '5',
          title: 'Team Planning Session',
          type: 'event',
          content: `Planning session for ${searchTerm} module. All team leads required to attend.`,
          timestamp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2)
        }
      ]
      
      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'message': return <MessageCircle className="h-4 w-4" />
      case 'document': return <FileText className="h-4 w-4" />
      case 'event': return <Calendar className="h-4 w-4" />
      case 'contact': return <User className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'message': return 'Message'
      case 'document': return 'Document'
      case 'event': return 'Event'
      case 'contact': return 'Contact'
      default: return 'Item'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground">Find messages, documents, and more</p>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search across all your conversations and documents..."
            className="pl-10 py-6 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button 
          size="lg" 
          onClick={handleSearch}
          disabled={isSearching || !searchTerm.trim()}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {searchResults.length > 0 ? (
        <Card className="flex-1 overflow-hidden">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>{searchResults.length} results found for "{searchTerm}"</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="divide-y">
                {searchResults.map((result) => (
                  <div key={result.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <h3 className="font-medium">{result.title}</h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatTime(result.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {getTypeLabel(result.type)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {result.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Search Your Content</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Enter a term above to search across all your conversations, documents, and saved content.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
            <Card className="p-4">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">Messages</h4>
              <p className="text-sm text-muted-foreground">Chat conversations</p>
            </Card>
            <Card className="p-4">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">Documents</h4>
              <p className="text-sm text-muted-foreground">Saved files and notes</p>
            </Card>
            <Card className="p-4">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">Events</h4>
              <p className="text-sm text-muted-foreground">Scheduled meetings</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}