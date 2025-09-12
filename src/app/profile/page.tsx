'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import Link from 'next/link'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Profile updated successfully')
        setIsEditing(false)
      } else {
        setMessage('Failed to update profile')
      }
    } catch (error) {
      setMessage('An error occurred while updating profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/auth/delete', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        await logout()
        router.push('/login')
      } else {
        setMessage('Failed to delete account')
      }
    } catch (error) {
      setMessage('An error occurred while deleting account')
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Profile</CardTitle>
          <CardDescription className="text-center">
            Your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {!isEditing ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                {message && (
                  <div className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                    {message}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">User ID:</span>
              <span className="text-muted-foreground">{user.id}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {!isEditing && (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/preferences">Preferences</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/change-password">Change Password</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/2fa">Two-Factor Authentication</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sessions">Manage Sessions</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/activity">Activity Logs</Link>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
            >
              Log out
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}