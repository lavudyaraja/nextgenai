import { NextRequest, NextResponse } from 'next/server'
import { users } from '../users'

export async function POST(request: NextRequest) {
  try {
    const { provider, token } = await request.json()

    // In a real application, you would:
    // 1. Verify the token with the provider (Google, GitHub, etc.)
    // 2. Get user information from the provider
    // 3. Check if user exists in your database
    // 4. Create user if they don't exist
    // 5. Generate your own session/token
    // 6. Return user data and token
    
    // For this demo, we'll just log the request and return a mock response
    console.log('Social login request:', { provider, token })
    
    // For demo purposes, we'll return the first user from our database
    // In a real app, you would create or find the user based on the social provider data
    if (users.length > 0) {
      // Remove password from response
      const { password, ...userWithoutPassword } = users[0]
      
      // Add avatar for social login
      const userWithAvatar = {
        ...userWithoutPassword,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
      
      return NextResponse.json({ 
        success: true, 
        user: userWithAvatar,
        message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful`
      })
    } else {
      // Create a mock user for social login if no users exist
      const mockUser = {
        id: 'social-123',
        name: 'Social User',
        email: `${provider}-user@example.com`,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
      
      return NextResponse.json({ 
        success: true, 
        user: mockUser,
        message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful`
      })
    }
  } catch (error) {
    console.error('Social login API error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}