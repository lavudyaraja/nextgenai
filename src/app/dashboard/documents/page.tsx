'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Search, 
  FileText, 
  Plus, 
  Folder, 
  Upload, 
  MoreHorizontal, 
  Download,
  Trash2,
  Eye,
  Edit3
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Document {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'txt' | 'image'
  size: string
  lastModified: Date
  owner: string
  sharedWith: number
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Sample documents data
  const documents: Document[] = [
    {
      id: '1',
      name: 'Project Requirements.pdf',
      type: 'pdf',
      size: '2.4 MB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24),
      owner: 'You',
      sharedWith: 3
    },
    {
      id: '2',
      name: 'Meeting Notes.doc',
      type: 'doc',
      size: '1.1 MB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 48),
      owner: 'You',
      sharedWith: 5
    },
    {
      id: '3',
      name: 'API Documentation.txt',
      type: 'txt',
      size: '0.8 MB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 72),
      owner: 'Team',
      sharedWith: 12
    },
    {
      id: '4',
      name: 'Design Mockups.zip',
      type: 'image',
      size: '5.2 MB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 100),
      owner: 'Sarah Johnson',
      sharedWith: 8
    },
    {
      id: '5',
      name: 'Financial Report Q2.pdf',
      type: 'pdf',
      size: '3.7 MB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 200),
      owner: 'Michael Chen',
      sharedWith: 2
    },
    {
      id: '6',
      name: 'User Research.txt',
      type: 'txt',
      size: '1.5 MB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 300),
      owner: 'You',
      sharedWith: 4
    }
  ]

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />
      case 'doc': return <FileText className="h-4 w-4 text-blue-500" />
      case 'txt': return <FileText className="h-4 w-4 text-green-500" />
      case 'image': return <FileText className="h-4 w-4 text-purple-500" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return 'Today'
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage your files and documents</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Folder className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Folders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Upload className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Shared</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">1.2 GB</p>
                <p className="text-sm text-muted-foreground">Storage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Your most recently accessed files</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-350px)]">
            <div className="divide-y">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-muted rounded-lg">
                      {getTypeIcon(document.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{document.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{document.size}</p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">{formatTime(document.lastModified)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{document.sharedWith}</span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}