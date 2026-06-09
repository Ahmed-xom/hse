'use client'

import { useFetchData } from '@/lib/use-fetch-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface Employee {
  id: string
  payroll_no: string
  employee_name: string
  email: string | null
  status: string | null
}

export default function EmployeesPage() {
  const { data: employees, loading } = useFetchData<Employee>({
    table: 'employees',
    orderBy: 'employee_name',
  })

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <p className="text-gray-600 mt-1">Manage and view employee information</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid gap-4">
          {employees.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-600">
                No employees found
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Payroll No</th>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(employee => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{employee.payroll_no}</td>
                      <td className="py-3 px-4 font-medium">{employee.employee_name}</td>
                      <td className="py-3 px-4 text-gray-600">{employee.email || '-'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                            employee.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {employee.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
