-- Create Business Units table
CREATE TABLE IF NOT EXISTS business_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT,
  primary_contact_email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Designations table
CREATE TABLE IF NOT EXISTS designations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  parent_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Job Positions table
CREATE TABLE IF NOT EXISTS job_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  parent_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Contractors table
CREATE TABLE IF NOT EXISTS contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Work Areas table
CREATE TABLE IF NOT EXISTS work_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_no TEXT NOT NULL UNIQUE,
  employee_name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  location_id UUID REFERENCES locations(id),
  business_unit_id UUID REFERENCES business_units(id),
  contractor_id UUID REFERENCES contractors(id),
  status TEXT,
  job_position_id UUID REFERENCES job_positions(id),
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role_id UUID REFERENCES roles(id),
  employee_id UUID REFERENCES employees(id),
  first_name TEXT,
  last_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code TEXT NOT NULL UNIQUE,
  course_name TEXT NOT NULL,
  course_category TEXT,
  instructor_name TEXT,
  course_duration_days INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Training Records table
CREATE TABLE IF NOT EXISTS training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  training_date DATE,
  completion_status TEXT,
  certificate_number TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Fleet/Equipment table
CREATE TABLE IF NOT EXISTS fleet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_name TEXT NOT NULL,
  asset_code TEXT UNIQUE,
  asset_type TEXT,
  asset_category TEXT,
  purchase_date DATE,
  acquisition_cost NUMERIC,
  location_id UUID REFERENCES locations(id),
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_type TEXT NOT NULL,
  inspection_date DATE,
  equipment_id UUID REFERENCES fleet(id),
  conducted_by_id UUID REFERENCES employees(id),
  location_id UUID REFERENCES locations(id),
  findings TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Observations table
CREATE TABLE IF NOT EXISTS observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id TEXT UNIQUE NOT NULL,
  observation_date DATE,
  observed_by_id UUID REFERENCES employees(id),
  location_id UUID REFERENCES locations(id),
  observation_type TEXT,
  description TEXT,
  severity TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE business_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for viewing data (allow all authenticated users to read)
CREATE POLICY "Allow authenticated users to view business_units" ON business_units
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view designations" ON designations
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view job_positions" ON job_positions
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view departments" ON departments
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view locations" ON locations
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view contractors" ON contractors
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view work_areas" ON work_areas
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view roles" ON roles
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view employees" ON employees
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view training_records" ON training_records
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view fleet" ON fleet
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view inspections" ON inspections
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to view observations" ON observations
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_employees_department_id ON employees(department_id);
CREATE INDEX idx_employees_business_unit_id ON employees(business_unit_id);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_training_records_employee_id ON training_records(employee_id);
CREATE INDEX idx_training_records_course_id ON training_records(course_id);
CREATE INDEX idx_fleet_location_id ON fleet(location_id);
CREATE INDEX idx_inspections_equipment_id ON inspections(equipment_id);
CREATE INDEX idx_observations_location_id ON observations(location_id);
