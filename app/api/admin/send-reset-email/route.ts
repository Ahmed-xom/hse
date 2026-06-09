import { createClient } from '@/lib/supabase/server'
import { sendPasswordResetEmail, generateResetToken, hashToken } from '@/lib/email-service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if current user is admin
    const { data: currentUserData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', currentUser.id)
      .single()

    if (!currentUserData?.is_admin) {
      return NextResponse.json(
        { error: 'Only admins can send password reset emails' },
        { status: 403 }
      )
    }

    const { userId, userEmail, userName } = await request.json()

    if (!userId || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'userId, userEmail, and userName are required' },
        { status: 400 }
      )
    }

    // Generate reset token
    const resetToken = generateResetToken()
    const hashedToken = hashToken(resetToken)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    // Store token in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_reset_token: hashedToken,
        password_reset_expires: expiresAt.toISOString(),
        password_reset_sent_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user with reset token:', updateError)
      return NextResponse.json(
        { error: 'Failed to generate reset link' },
        { status: 500 }
      )
    }

    // Send email
    const emailSent = await sendPasswordResetEmail(userEmail, userName, resetToken)

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Password reset email sent successfully',
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('Send reset email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
