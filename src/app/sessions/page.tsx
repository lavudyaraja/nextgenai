'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Session {
  id: string
  device: string
  ip: string
  lastActive: string
  current: boolean
}

export default function SessionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    fetchSessions()
  }, [user, router])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      setError('')
      
      // In a real app, this would call your sessions API
      console.log('Fetching sessions')
      
      // Mock sessions data
      const mockSessions: Session[] = [
        {
          id: 'session-1',
          device: 'Chrome on Windows',
          ip: '192.168.1.1',
          lastActive: new Date().toISOString(),
          current: true
        },
        {
          id: 'session-2',
          device: 'Safari on iPhone',
          ip: '192.168.1.2',
          lastActive: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          current: false
        },
        {
          id: 'session-3',
          device: 'Firefox on macOS',
          ip: '192.168.1.3',
          lastActive: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          current: false
        }
      ]
      
      setSessions(mockSessions)
    } catch (err) {
      setError('Failed to fetch sessions')
    } finally {
      setLoading(false)
    }
  }

  const terminateSession = async (sessionId: string) => {
    try {
      // In a real app, this would call your sessions API
      console.log('Terminating session:', sessionId)
      
      // Remove session from local state
      setSessions(sessions.filter(session => session.id !== sessionId))
    } catch (err) {
      setError('Failed to terminate session')
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Not logged in</h2>
          <Button onClick={() => router.push('/login')}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Active Sessions</CardTitle>
          <CardDescription className="text-center">
            Manage your active sessions across devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.device}</TableCell>
                      <TableCell>{session.ip}</TableCell>
                      <TableCell>
                        {new Date(session.lastActive).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {session.current ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Current
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            Active
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {!session.current && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Terminate
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Terminate Session?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will log out the device associated with this session. 
                                  The user will need to log in again to continue using the application on that device.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => terminateSession(session.id)}
                                >
                                  Terminate Session
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="text-sm text-muted-foreground">
                <p>
                  Current session: This is the device you are currently using. 
                  Terminating other sessions will log them out immediately.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}