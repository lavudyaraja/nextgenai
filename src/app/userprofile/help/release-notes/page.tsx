'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ReleaseNotesPage() {
  const releases = [
    {
      version: 'v1.2.0',
      date: 'September 5, 2025',
      type: 'New',
      features: [
        'Added real-time collaboration features',
        'Improved message search functionality',
        'Enhanced security with end-to-end encryption',
        'New dark mode theme options'
      ]
    },
    {
      version: 'v1.1.5',
      date: 'August 22, 2025',
      type: 'Improvement',
      features: [
        'Performance optimizations for large conversations',
        'Bug fixes for file uploads',
        'UI improvements for mobile devices',
        'Enhanced accessibility features'
      ]
    },
    {
      version: 'v1.1.0',
      date: 'August 10, 2025',
      type: 'New',
      features: [
        'Introduced voice messaging capabilities',
        'Added support for custom emoji packs',
        'Implemented message scheduling feature',
        'New analytics dashboard for team admins'
      ]
    },
    {
      version: 'v1.0.5',
      date: 'July 18, 2025',
      type: 'Fix',
      features: [
        'Resolved notification delivery issues',
        'Fixed login problems for some users',
        'Improved stability of video calls',
        'Addressed memory leaks in long sessions'
      ]
    }
  ]

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'New': return 'default'
      case 'Improvement': return 'secondary'
      case 'Fix': return 'outline'
      default: return 'default'
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Release Notes</h1>
        <p className="text-muted-foreground">
          Stay up to date with the latest improvements and features.
        </p>
      </div>

      <div className="space-y-6">
        {releases.map((release, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    {release.version}
                    <Badge variant={getTypeVariant(release.type)}>
                      {release.type}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Released on {release.date}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {release.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <span className="mr-2 mt-1 h-2 w-2 rounded-full bg-primary"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}