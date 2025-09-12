'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, Download, ExternalLink } from 'lucide-react'

export default function DocumentsPage() {
  const documents = [
    {
      title: 'User Guide',
      description: 'Comprehensive guide to using all features of AI Assistant',
      type: 'PDF',
      size: '2.4 MB',
      lastUpdated: 'September 1, 2025'
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for developers integrating with our API',
      type: 'PDF',
      size: '1.8 MB',
      lastUpdated: 'August 28, 2025'
    },
    {
      title: 'Administrator Manual',
      description: 'Guide for system administrators and team managers',
      type: 'PDF',
      size: '3.1 MB',
      lastUpdated: 'August 15, 2025'
    },
    {
      title: 'Security Best Practices',
      description: 'Recommendations for maintaining security and privacy',
      type: 'PDF',
      size: '1.2 MB',
      lastUpdated: 'July 22, 2025'
    }
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Documents & Resources</h1>
        <p className="text-muted-foreground">
          Access helpful documents and resources to get the most out of AI Assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <span>{doc.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{doc.description}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{doc.type} • {doc.size}</span>
                <span>Updated {doc.lastUpdated}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                  <Link href="#">
                    <Download className="h-4 w-4" />
                    Download
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                  <Link href="#">
                    <ExternalLink className="h-4 w-4" />
                    View Online
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Need Additional Documents?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you need access to specific documents or resources not listed here, please contact our support team.
            </p>
            <Button asChild>
              <Link href="/support/contact">
                Request Documents
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}