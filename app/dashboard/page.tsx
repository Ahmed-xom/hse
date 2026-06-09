'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Loader2, Users, Briefcase, Truck, AlertCircle, BookOpen } from 'lucide-react'

export default function Dashboard() {
  const { userProfile, loading: authLoading } = useAuth()
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    vehicles: 0,
    observations: 0,
    courses: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading) {
      fetchStats()
    }
  }, [authLoading])

  async function fetchStats() {
    try {
      const [employeesRes, departmentsRes, vehiclesRes, observationsRes, coursesRes] = await Promise.all([
        supabase.from('employees').select('id', { count: 'exact', head: true }),
        supabase.from('departments').select('id', { count: 'exact', head: true }),
        supabase.from('fleet_vehicles').select('id', { count: 'exact', head: true }),
        supabase.from('near_miss_observations').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
      ])

      setStats({
        employees: employeesRes.count || 0,
        departments: departmentsRes.count || 0,
        vehicles: vehiclesRes.count || 0,
        observations: observationsRes.count || 0,
        courses: coursesRes.count || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome to HSE Dashboard</h1>
        <p className="text-gray-600 mt-2">
          {userProfile ? `Welcome, ${userProfile.first_name || userProfile.email}` : 'Welcome to your dashboard'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.employees}</div>
              <Users className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.departments}</div>
              <Briefcase className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.vehicles}</div>
              <Truck className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.observations}</div>
              <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.courses}</div>
              <BookOpen className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access common features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/employees" className="block">
              <Button variant="outline" className="w-full justify-start">
                View Employees
              </Button>
            </Link>
            <Link href="/dashboard/departments" className="block">
              <Button variant="outline" className="w-full justify-start">
                View Departments
              </Button>
            </Link>
            <Link href="/dashboard/fleet" className="block">
              <Button variant="outline" className="w-full justify-start">
                Fleet Management
              </Button>
            </Link>
            <Link href="/dashboard/training" className="block">
              <Button variant="outline" className="w-full justify-start">
                Training Records
              </Button>
            </Link>
          </CardContent>
        </Card>

        {userProfile?.is_admin && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Tools</CardTitle>
              <CardDescription>Administration and management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/users-management" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Manage Users & Reset Passwords
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
