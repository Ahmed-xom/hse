'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  is_admin: boolean
  created_at: string
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [resettingUserId, setResettingUserId] = useState<string | null>(null)
  const [sendingEmailUserId, setSendingEmailUserId] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [showPasswordInput, setShowPasswordInput] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setMessage({ type: 'error', text: 'Failed to load users' })
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(userId: string) {
    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setResettingUserId(userId)
    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setMessage({ type: 'success', text: 'Password reset successfully' })
      setNewPassword('')
      setShowPasswordInput(null)
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error resetting password:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to reset password' })
    } finally {
      setResettingUserId(null)
    }
  }

  async function handleSendResetEmail(user: User) {
    setSendingEmailUserId(user.id)
    try {
      const response = await fetch('/api/admin/send-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          userName: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      setMessage({ type: 'success', text: `Password reset email sent to ${user.email}` })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error sending reset email:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to send reset email' })
    } finally {
      setSendingEmailUserId(null)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-gray-600 mt-1">Manage system users and reset passwords</p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid gap-4">
          {users.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-600">
                No users found
              </CardContent>
            </Card>
          ) : (
            users.map(user => (
              <Card key={user.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.email}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {user.is_admin && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {showPasswordInput === user.id ? (
                        <>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleResetPassword(user.id)}
                            disabled={resettingUserId === user.id || !newPassword}
                            size="sm"
                          >
                            {resettingUserId === user.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Resetting...
                              </>
                            ) : (
                              'Confirm'
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setShowPasswordInput(null)
                              setNewPassword('')
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => setShowPasswordInput(user.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Set Password
                          </Button>
                          <Button
                            onClick={() => handleSendResetEmail(user)}
                            disabled={sendingEmailUserId === user.id}
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {sendingEmailUserId === user.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              'Send Reset Email'
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
