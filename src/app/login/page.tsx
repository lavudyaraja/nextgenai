'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Github, Mail, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts'

export default function LoginPage() {
  const router = useRouter()
  const { login, socialLogin } = useAuth()
  
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  
  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Validation state
  const [touched, setTouched] = useState({
    email: false,
    password: false
  })

  // Validation helpers
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const getFieldError = (field: string) => {
    if (!touched[field as keyof typeof touched]) return ''
    
    switch (field) {
      case 'email':
        if (!email) return 'Email is required'
        return !validateEmail(email) ? 'Please enter a valid email address' : ''
      case 'password':
        return !password ? 'Password is required' : ''
      default:
        return ''
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    })
    
    // Validation
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    if (!password) {
      setError('Please enter your password')
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      const result = await login(email.trim().toLowerCase(), password)
      
      if (result.success) {
        // Handle remember me (in production, this would set a longer-lived token)
        if (rememberMe) {
          // Store preference (but not sensitive data)
          try {
            localStorage.setItem('rememberMe', 'true')
          } catch (e) {
            console.warn('Unable to store remember me preference:', e)
          }
        }
        
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(result.message || 'Invalid email or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true)
      setError('')
      
      // In production, this would redirect to OAuth provider
      const result = await socialLogin(provider, `mock-${provider}-token`)
      
      if (result.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(result.message || `${provider === 'google' ? 'Google' : 'GitHub'} login failed`)
      }
    } catch (err) {
      console.error(`${provider} login error:`, err)
      setError(`${provider === 'google' ? 'Google' : 'GitHub'} login failed. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key on social buttons
  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      callback()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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
                onBlur={() => handleBlur('email')}
                disabled={isLoading}
                required
                autoComplete="email"
                className={getFieldError('email') ? 'border-destructive' : ''}
              />
              {getFieldError('email') && (
                <p className="text-xs text-destructive">{getFieldError('email')}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-medium text-primary hover:underline"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                  className={getFieldError('password') ? 'border-destructive pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {getFieldError('password') && (
                <p className="text-xs text-destructive">{getFieldError('password')}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal cursor-pointer"
              >
                Remember me for 30 days
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              Or continue with
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              type="button"
            >
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              type="button"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <p className="text-sm text-muted-foreground text-center">
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