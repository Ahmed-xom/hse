import { createClient } from '@/lib/supabase/server'

// Fetch all employees
export async function getAllEmployees() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('employees').select('*').order('employee_name')

  if (error) {
    console.error('Error fetching employees:', error)
    return []
  }
  return data || []
}

// Fetch employee by ID
export async function getEmployeeById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('employees').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching employee:', error)
    return null
  }
  return data
}

// Fetch departments
export async function getDepartments() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('departments').select('*').order('name')

  if (error) {
    console.error('Error fetching departments:', error)
    return []
  }
  return data || []
}

// Fetch locations
export async function getLocations() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('locations').select('*').order('name')

  if (error) {
    console.error('Error fetching locations:', error)
    return []
  }
  return data || []
}

// Fetch business units
export async function getBusinessUnits() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('business_units').select('*').order('name')

  if (error) {
    console.error('Error fetching business units:', error)
    return []
  }
  return data || []
}

// Fetch roles
export async function getRoles() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('roles').select('*').order('name')

  if (error) {
    console.error('Error fetching roles:', error)
    return []
  }
  return data || []
}

// Fetch courses
export async function getCourses() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('courses').select('*').order('name')

  if (error) {
    console.error('Error fetching courses:', error)
    return []
  }
  return data || []
}

// Fetch training records
export async function getTrainingRecords() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('training_records')
    .select(`
      *,
      employee:employees(employee_name),
      course:courses(name)
    `)
    .order('training_date', { ascending: false })

  if (error) {
    console.error('Error fetching training records:', error)
    return []
  }
  return data || []
}

// Fetch fleet vehicles
export async function getFleetVehicles() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('fleet_vehicles')
    .select(`
      *,
      location:locations(name)
    `)
    .order('registration_no')

  if (error) {
    console.error('Error fetching fleet vehicles:', error)
    return []
  }
  return data || []
}

// Fetch vehicle inspections
export async function getVehicleInspections() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vehicle_inspections')
    .select(`
      *,
      vehicle:fleet_vehicles(registration_no),
      inspector:employees(employee_name)
    `)
    .order('inspection_date', { ascending: false })

  if (error) {
    console.error('Error fetching vehicle inspections:', error)
    return []
  }
  return data || []
}

// Fetch near miss observations
export async function getNearMissObservations() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('near_miss_observations')
    .select(`
      *,
      employee:employees(employee_name),
      location:locations(name)
    `)
    .order('observation_date', { ascending: false })

  if (error) {
    console.error('Error fetching near miss observations:', error)
    return []
  }
  return data || []
}

// Fetch all users for admin panel
export async function getAllUsers() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }
  return data || []
}
