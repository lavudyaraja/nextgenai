import { NextRequest, NextResponse } from 'next/server'
import { users } from '../users'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // In a real application, you would:
    // 1. Check if the user exists
    // 2. Generate a verification token
    // 3. Send a verification email
    // 4. Return success response
    
    // For this demo, we'll check if the user exists in our array
    const user = users.find(u => u.email === email)
    
    if (user) {
      // In a real app, you would generate a token and send an email
      console.log('Email verification request for:', email)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Verification email sent successfully'
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 })
    }
  } catch (error) {
    console.error('Email verification API error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}