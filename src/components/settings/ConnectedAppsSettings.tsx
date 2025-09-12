'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, Link, Globe, Github, Twitter, Facebook, Linkedin } from 'lucide-react'

interface ConnectedApp {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  connected: boolean
  lastUsed?: string
}

interface ConnectedAppsSettingsProps {
  onSave?: () => void
}

export function ConnectedAppsSettings({ onSave }: ConnectedAppsSettingsProps) {
  const [apps, setApps] = useState<ConnectedApp[]>([
    { id: 'google', name: 'Google', icon: Globe, connected: true, lastUsed: '2023-06-15' },
    { id: 'github', name: 'GitHub', icon: Github, connected: true, lastUsed: '2023-06-10' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, connected: false },
    { id: 'facebook', name: 'Facebook', icon: Facebook, connected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, connected: false },
  ])
  const [message, setMessage] = useState<string>('')

  const handleConnectApp = (appId: string) => {
    setApps(apps.map(app => 
      app.id === appId ? { ...app, connected: true, lastUsed: new Date().toISOString().split('T')[0] } : app
    ))
    const appName = apps.find(app => app.id === appId)?.name || 'App'
    setMessage(`${appName} connected successfully`)
  }

  const handleDisconnectApp = (appId: string) => {
    setApps(apps.map(app => 
      app.id === appId ? { ...app, connected: false, lastUsed: undefined } : app
    ))
    const appName = apps.find(app => app.id === appId)?.name || 'App'
    setMessage(`${appName} disconnected successfully`)
  }

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log('Saving connected apps settings')
    setMessage('Connected apps settings updated successfully')
    onSave?.()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Apps</CardTitle>
          <CardDescription>Manage third-party applications connected to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert className="border-green-500 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Connections</h3>
            <div className="space-y-3">
              {apps.map((app) => {
                const Icon = app.icon
                return (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-lg">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <Label>{app.name}</Label>
                        {app.connected && app.lastUsed && (
                          <p className="text-sm text-muted-foreground">
                            Last used: {app.lastUsed}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.connected ? (
                        <>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Connected
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDisconnectApp(app.id)}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleConnectApp(app.id)}
                          className="flex items-center gap-2"
                        >
                          <Link className="h-4 w-4" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Developer Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>API Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Manage API keys and developer access
                  </p>
                </div>
                <Button variant="outline">Manage API Keys</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>OAuth Applications</Label>
                  <p className="text-sm text-muted-foreground">
                    Manage OAuth applications you've created
                  </p>
                </div>
                <Button variant="outline">Manage Apps</Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}