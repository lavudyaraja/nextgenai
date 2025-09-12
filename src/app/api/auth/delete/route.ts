import { NextRequest, NextResponse } from 'next/server'
import { users } from '../users'

export async function DELETE(request: NextRequest) {
  try {
    // In a real application, you would:
    // 1. Validate the session/token
    // 2. Check if the user exists
    // 3. Delete the user data from the database
    // 4. Invalidate the session
    
    // For this demo, we'll remove the first user from our array
    if (users.length > 0) {
      users.shift() // Remove the first user
      
      return NextResponse.json({ 
        success: true, 
        message: 'User account deleted successfully'
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 })
    }
  } catch (error) {
    console.error('User deletion API error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}