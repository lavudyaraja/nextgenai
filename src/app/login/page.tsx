'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Github, Mail } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts'

export default function LoginPage() {
  const router = useRouter()
  const { login, socialLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await login(email, password)
      
      if (result.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(result.message || 'Invalid email or password')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      // In a real app, this would redirect to Google OAuth
      // For demo purposes, we'll simulate a successful login
      setIsLoading(true)
      setError('')
      
      const result = await socialLogin('google', 'mock-google-token')
      
      if (result.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(result.message || 'Google login failed')
      }
    } catch (err) {
      setError('Google login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    try {
      // In a real app, this would redirect to GitHub OAuth
      // For demo purposes, we'll simulate a successful login
      setIsLoading(true)
      setError('')
      
      const result = await socialLogin('github', 'mock-github-token')
      
      if (result.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(result.message || 'GitHub login failed')
      }
    } catch (err) {
      setError('GitHub login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <Separator className="my-6" />
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGithubLogin}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}