# Admin Reset Password Feature - Documentation

## Overview

The admin password reset feature allows system administrators to reset user passwords directly from the dashboard without requiring email verification or temporary passwords.

## Location

**URL**: `/admin/users-management`
**Access**: Admin users only
**Route**: `app/admin/users-management/page.tsx`

## Features

### 1. User List View
- Displays all system users in cards
- Shows user details:
  - User name (first + last name) or email
  - Email address
  - Join date
  - Admin status badge (if admin)

### 2. Password Reset Button
- Each user has a "Reset Password" button
- Click to reveal password input field
- Admin can enter new password (minimum 6 characters)
- Confirm button to apply reset

### 3. Security Verification
- Only authenticated users can access the page
- Automatic check: user must be admin (`is_admin = true`)
- Returns 403 error if non-admin attempts to reset
- API validates admin status on each request

### 4. User Feedback
- Success message on password reset
- Error messages for failures
- Loading state while processing
- Auto-dismisses success message after 3 seconds

## How It Works

### Frontend Flow
1. User navigates to `/admin/users-management`
2. Page loads and fetches all users from Supabase
3. Displays each user in a card format
4. Admin clicks "Reset Password" button
5. Password input field appears
6. Admin enters new password
7. Clicks "Confirm" to reset
8. API call made to `/api/admin/reset-password`
9. Success/error notification shown

### Backend Flow
1. POST request to `/api/admin/reset-password`
2. Extract current user ID from session
3. Verify current user is admin
4. Validate userId and newPassword provided
5. Call Supabase admin API: `auth.admin.updateUserById()`
6. Update password for target user
7. Return success response

## API Endpoint

**Endpoint**: `POST /api/admin/reset-password`
**File**: `app/api/admin/reset-password/route.ts`

### Request Body
```json
{
  "userId": "uuid-of-user",
  "newPassword": "new_password_123"
}
```

### Response (Success)
```json
{
  "message": "Password reset successfully"
}
```

### Response (Error)
```json
{
  "error": "Error message describing what went wrong"
}
```

### Error Codes
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (not admin)
- `400`: Bad request (missing fields or invalid password)
- `500`: Server error

## Database Tables Used

### `public.users` Table
```sql
id UUID PRIMARY KEY              -- Links to auth.users
email TEXT NOT NULL
is_admin BOOLEAN DEFAULT FALSE   -- Determines admin access
first_name TEXT
last_name TEXT
created_at TIMESTAMP
```

## Security Measures

### 1. Admin-Only Access
- Frontend: UI only shows for admin users
- Backend: API validates `is_admin = true`
- Cannot bypass with direct API calls

### 2. Password Validation
- Minimum 6 characters enforced by frontend
- Supabase validates on backend
- Passwords hashed by Supabase auth

### 3. Session Security
- Uses Supabase session tokens
- Middleware validates on each request
- Token refresh handled automatically

### 4. Audit
- All password resets go through API
- Can be logged/audited if needed
- Direct admin API calls required

## Code Examples

### Checking if User is Admin
```tsx
const { userProfile, isAdmin } = useAuth()

if (!isAdmin) {
  return <AccessDenied />
}
```

### Making Reset API Call
```tsx
const response = await fetch('/api/admin/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    userId: selectedUser.id, 
    newPassword: newPassword 
  }),
})
```

### Verifying Admin Status (Server)
```tsx
const { data: currentUserData } = await supabase
  .from('users')
  .select('is_admin')
  .eq('id', currentUser.id)
  .single()

if (!currentUserData?.is_admin) {
  return NextResponse.json({ error: 'Only admins can reset passwords' }, { status: 403 })
}
```

## User Experience

### Steps for Admin to Reset Password

1. **Login**: Navigate to `/auth/login` and enter credentials
2. **Go to Users**: After dashboard loads, click "User Management" button
3. **Find User**: Locate the user in the list
4. **Reset**: Click "Reset Password" button on their card
5. **Enter Password**: Type new password in the input field
6. **Confirm**: Click "Confirm" button
7. **Wait**: Message appears indicating success or error
8. **Done**: Password is now reset

### User Experience (after password reset)
- User receives notification of password reset (optional - can add email)
- User logs out automatically (if desired)
- User can login with new password immediately

## Extending the Feature

### Add Email Notification
```tsx
// After successful reset, send email
await supabase.from('email_queue').insert({
  user_id: userId,
  template: 'password_reset',
  to: userEmail,
  data: { new_password: newPassword }
})
```

### Add Audit Logging
```tsx
// Log password reset action
await supabase.from('admin_audit_log').insert({
  admin_id: adminUser.id,
  action: 'password_reset',
  target_user_id: userId,
  timestamp: new Date()
})
```

### Add Confirmation Dialog
```tsx
const confirmed = await confirm(
  `Reset password for ${user.email}? They will be able to login with the new password immediately.`
)
if (!confirmed) return
```

### Send Temporary Password Instead
```tsx
// Generate temporary password
const tempPassword = generateRandomPassword()

// Update user with temporary password
await resetPassword(userId, tempPassword)

// Send email to user
await sendEmail({
  to: userEmail,
  subject: 'Your password has been reset',
  body: `Your temporary password is: ${tempPassword}`
})
```

## Troubleshooting

### Reset Button Not Showing
- Verify user is logged in
- Check browser console for errors
- Verify user is marked as admin in database

### "Only admins can reset passwords" Error
- Verify `is_admin = true` in `public.users` table
- Check if user UUID matches in both auth and users table
- Try logging out and back in

### Password Reset Fails
- Check password meets minimum requirements (6 characters)
- Verify Supabase connection is working
- Check browser console for full error message

### Users List Not Loading
- Check internet connection
- Verify Supabase URL and key in .env.local
- Try refreshing the page
- Check browser console for errors

## Best Practices

1. **Inform Users**: Send email notification when password is reset
2. **Log Changes**: Keep audit trail of who reset which password
3. **Strong Passwords**: Recommend strong password policy
4. **Session Termination**: Consider logging user out after reset
5. **Admin Access**: Limit who has admin access
6. **Regular Testing**: Test password reset feature regularly

## File References

| File | Purpose |
|------|---------|
| `app/admin/users-management/page.tsx` | UI component for password reset |
| `app/api/admin/reset-password/route.ts` | API endpoint |
| `lib/auth-context.tsx` | Authentication context |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server Supabase client |

## Summary

The password reset feature provides admins with a secure, intuitive way to reset user passwords directly from the dashboard. With proper security measures in place, it allows for efficient user account management without compromising security.
