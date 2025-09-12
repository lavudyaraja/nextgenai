'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthDocsPage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Authentication System</h1>
          <p className="text-muted-foreground">
            Documentation for the authentication system implementation
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              The authentication system provides user login, signup, and session management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This authentication system is built with Next.js App Router and uses client-side context 
              for state management. It includes the following features:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Email/password authentication</li>
              <li>Social login (Google, GitHub)</li>
              <li>User session management</li>
              <li>Protected routes</li>
              <li>Password reset functionality</li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pages</CardTitle>
              <CardDescription>
                Authentication-related pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Login Page</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/signup">Signup Page</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/forgot-password">Forgot Password</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">Profile Page</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Routes</CardTitle>
              <CardDescription>
                Authentication API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 bg-muted rounded-md">
                <code className="text-sm">POST /api/auth</code>
                <p className="text-xs text-muted-foreground mt-1">Main auth endpoint</p>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <code className="text-sm">POST /api/auth/logout</code>
                <p className="text-xs text-muted-foreground mt-1">Logout endpoint</p>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <code className="text-sm">POST /api/auth/forgot-password</code>
                <p className="text-xs text-muted-foreground mt-1">Password reset endpoint</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Context Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The authentication system uses React Context for state management. 
              Wrap your application with the <code className="bg-muted px-1 rounded">AuthProvider</code>:
            </p>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`// In your root layout
import { AuthProvider } from '@/contexts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Using Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Access authentication state and methods using the <code className="bg-muted px-1 rounded">useAuth</code> hook:
            </p>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`import { useAuth } from '@/contexts'

export default function MyComponent() {
  const { user, login, logout, signup } = useAuth()
  
  // Check if user is logged in
  if (!user) {
    return <div>Please log in</div>
  }
  
  return <div>Welcome, {user.name}!</div>
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}