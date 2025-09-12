import { NextRequest, NextResponse } from 'next/server'
import { users } from '../users'

export async function PUT(request: NextRequest) {
  try {
    const { name, email } = await request.json()

    // In a real application, you would:
    // 1. Validate the session/token
    // 2. Check if the user exists
    // 3. Update the user data in the database
    // 4. Return the updated user data
    
    // For this demo, we'll update the first user in our array
    if (users.length > 0) {
      // Update the first user
      users[0] = {
        ...users[0],
        name: name || users[0].name,
        email: email || users[0].email
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = users[0]
      
      // Add avatar for display
      const userWithAvatar = {
        ...userWithoutPassword,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
      
      return NextResponse.json({ 
        success: true, 
        user: userWithAvatar,
        message: 'User updated successfully'
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 })
    }
  } catch (error) {
    console.error('User update API error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}