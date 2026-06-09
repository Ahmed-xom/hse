import { createClient } from '@/lib/supabase/server'
import { hashToken } from '@/lib/email-service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const hashedToken = hashToken(token)

    // Find user with matching token
    const { data: userData, error: findError } = await supabase
      .from('users')
      .select('id, email, password_reset_expires')
      .eq('password_reset_token', hashedToken)
      .single()

    if (findError || !userData) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (new Date() > new Date(userData.password_reset_expires)) {
      return NextResponse.json(
        { error: 'Password reset link has expired' },
        { status: 400 }
      )
    }

    // Get user from auth
    const { data: authUser } = await supabase.auth.admin.getUserById(userData.id)

    if (!authUser.user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update password in auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userData.id,
      { password: newPassword }
    )

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      )
    }

    // Clear reset token from database
    await supabase
      .from('users')
      .update({
        password_reset_token: null,
        password_reset_expires: null,
      })
      .eq('id', userData.id)

    return NextResponse.json({
      message: 'Password has been reset successfully',
      email: userData.email,
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
