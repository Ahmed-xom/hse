import nodemailer from 'nodemailer'
import crypto from 'crypto'

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || 'hsesystem.xom@outlook.com'
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'Xom@2026'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
})

// Generate reset token
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Hash token for storage
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// Email HTML template
function getResetEmailTemplate(userName: string, resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2c3e50; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { color: #7f8c8d; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
          .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HSE Dashboard - Password Reset</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>You have requested to reset your password for your HSE Dashboard account.</p>
            
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #ecf0f1; padding: 10px; border-radius: 5px;">
              ${resetLink}
            </p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <p>This link will expire in 30 minutes. If you did not request a password reset, please ignore this email or contact your administrator.</p>
            </div>
            
            <p>Best regards,<br>HSE Dashboard Admin Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2026 HSE System. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

// Send password reset email
export async function sendPasswordResetEmail(
  userEmail: string,
  userName: string,
  resetToken: string
): Promise<boolean> {
  try {
    const resetLink = `${APP_URL}/auth/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: EMAIL_USER,
      to: userEmail,
      subject: 'Password Reset Request - HSE Dashboard',
      html: getResetEmailTemplate(userName, resetLink),
    }

    await transporter.sendMail(mailOptions)
    console.log(`Password reset email sent to ${userEmail}`)
    return true
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return false
  }
}

// Verify email configuration
export async function verifyEmailConfiguration(): Promise<boolean> {
  try {
    await transporter.verify()
    console.log('✓ Email configuration verified successfully')
    return true
  } catch (error) {
    console.error('✗ Email configuration error:', error)
    return false
  }
}
