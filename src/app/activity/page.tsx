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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface ActivityLog {
  id: string
  action: string
  timestamp: string
  ip: string
  userAgent: string
  location: string
}

export default function ActivityLogsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    fetchActivityLogs()
  }, [user, router])

  const fetchActivityLogs = async () => {
    try {
      setLoading(true)
      setError('')
      
      // In a real app, this would call your activity logs API
      console.log('Fetching activity logs')
      
      // Mock activity logs
      const mockLogs: ActivityLog[] = [
        {
          id: 'log-1',
          action: 'login',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
          location: 'New York, US'
        },
        {
          id: 'log-2',
          action: 'password_change',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
          location: 'New York, US'
        },
        {
          id: 'log-3',
          action: 'login',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          ip: '192.168.1.2',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) Safari/605.1.15',
          location: 'San Francisco, US'
        },
        {
          id: 'log-4',
          action: 'profile_update',
          timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
          location: 'New York, US'
        }
      ]
      
      setLogs(mockLogs)
    } catch (err) {
      setError('Failed to fetch activity logs')
    } finally {
      setLoading(false)
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
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Activity Logs</CardTitle>
          <CardDescription className="text-center">
            View your account activity history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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
                    <TableHead>Action</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium capitalize">
                        {log.action.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>{log.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="text-sm text-muted-foreground">
                <p>
                  These logs show the activity on your account. If you see any suspicious activity, 
                  please change your password immediately.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}