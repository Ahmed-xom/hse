import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface DataMap {
  [key: string]: any[];
}

const xlsDir = '/tmp/himaya';

async function loadDataFromXLS() {
  const files = fs
    .readdirSync(xlsDir)
    .filter((f) => f.endsWith('.xls'))
    .sort();

  console.log(`Found ${files.length} Excel files to process\n`);

  const dataMap: DataMap = {
    businessUnits: [],
    designations: [],
    jobPositions: [],
    departments: [],
    locations: [],
    contractors: [],
    workAreas: [],
    roles: [],
    employees: [],
    users: [],
  };

  // Process files
  for (const file of files) {
    const filePath = path.join(xlsDir, file);
    try {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(sheet);

      // Skip header rows
      const data = rawData.slice(1).filter((row: any) => {
        const firstValue = Object.values(row)[0];
        return firstValue && firstValue !== '';
      });

      if (file.includes('37')) {
        // Business Units
        dataMap.businessUnits.push(
          ...data.map((row: any) => ({
            name: Object.values(row)[0],
            type: Object.values(row)[1],
            description: Object.values(row)[5] || '',
          }))
        );
      } else if (file.includes('38')) {
        // Departments
        dataMap.departments.push(
          ...data.map((row: any) => ({
            name: Object.values(row)[0],
            description: Object.values(row)[1] || '',
          }))
        );
      } else if (file.includes('39')) {
        // Designations
        dataMap.designations.push(
          ...data.map((row: any) => ({
            name: Object.values(row)[0],
            parent_name: Object.values(row)[1] || null,
            description: Object.values(row)[2] || '',
          }))
        );
      } else if (file.includes('40')) {
        // Job Positions
        dataMap.jobPositions.push(
          ...data.map((row: any) => ({
            name: Object.values(row)[0],
            parent_name: Object.values(row)[1] || null,
            description: Object.values(row)[2] || '',
          }))
        );
      } else if (file.includes('41')) {
        // Locations
        dataMap.locations.push(
          ...data.map((row: any) => ({
            name: Object.values(row)[0],
            description: Object.values(row)[1] || '',
          }))
        );
      } else if (file.includes('42')) {
        // Employees
        dataMap.employees.push(
          ...data.map((row: any) => ({
            payroll_no: Object.values(row)[0],
            employee_name: Object.values(row)[1],
            department_name: Object.values(row)[2],
            location_name: Object.values(row)[3],
            business_unit_name: Object.values(row)[4],
            status: Object.values(row)[5],
            job_position_name: Object.values(row)[6],
            email: Object.values(row)[7],
          }))
        );
      } else if (file.includes('43') || file.includes('45')) {
        // Roles
        dataMap.roles.push(
          ...data.map((row: any) => ({
            name: Object.values(row)[0],
            description: Object.values(row)[1] || '',
          }))
        );
      } else if (file.includes('46')) {
        // Users
        dataMap.users.push(
          ...data.map((row: any) => ({
            email: Object.values(row)[0],
            first_name: Object.values(row)[1],
            last_name: Object.values(row)[2],
            role_name: Object.values(row)[3],
          }))
        );
      } else if (file.includes('54')) {
        // Work Areas
        dataMap.workAreas.push(
          ...data.map((row: any) => ({
            name: Object.values(row)[0],
            description: Object.values(row)[1] || '',
          }))
        );
      } else if (file.includes('55')) {
        // Contractors
        dataMap.contractors.push(
          ...data.map((row: any) => ({
            name: Object.values(row)[0],
            description: Object.values(row)[1] || '',
          }))
        );
      }
    } catch (error) {
      console.warn(`Warning: Could not process ${file}`);
    }
  }

  return dataMap;
}

async function insertUniqueData(table: string, data: any[], keyField: string) {
  if (data.length === 0) return [];

  // Remove duplicates based on key field
  const unique = Array.from(
    new Map(data.map((item) => [item[keyField], item])).values()
  );

  try {
    // First, try to insert normally
    const { error } = await supabase.from(table).insert(unique);
    
    if (error && error.code === '23505') {
      // Unique violation - do update instead
      for (const item of unique) {
        await supabase.from(table).update(item).eq(keyField, item[keyField]);
      }
      console.log(`✓ Updated ${unique.length} records in ${table} table`);
      return unique;
    } else if (error) {
      console.error(`Error inserting into ${table}:`, error);
      return [];
    } else {
      console.log(`✓ Inserted ${unique.length} records into ${table} table`);
      return unique;
    }
  } catch (err) {
    console.error(`Exception inserting into ${table}:`, err);
    return [];
  }
}

async function main() {
  try {
    console.log('Loading Excel data...\n');
    const data = await loadDataFromXLS();

    console.log('Uploading to Supabase...\n');

    // Insert data in order of dependencies
    const businessUnits = await insertUniqueData(
      'business_units',
      data.businessUnits,
      'name'
    );
    console.log(`Business Units: ${data.businessUnits.length} records`);

    const departments = await insertUniqueData(
      'departments',
      data.departments,
      'name'
    );
    console.log(`Departments: ${data.departments.length} records`);

    const locations = await insertUniqueData('locations', data.locations, 'name');
    console.log(`Locations: ${data.locations.length} records`);

    const workAreas = await insertUniqueData('work_areas', data.workAreas, 'name');
    console.log(`Work Areas: ${data.workAreas.length} records`);

    const contractors = await insertUniqueData(
      'contractors',
      data.contractors,
      'name'
    );
    console.log(`Contractors: ${data.contractors.length} records`);

    const designations = await insertUniqueData(
      'designations',
      data.designations,
      'name'
    );
    console.log(`Designations: ${data.designations.length} records`);

    const jobPositions = await insertUniqueData(
      'job_positions',
      data.jobPositions,
      'name'
    );
    console.log(`Job Positions: ${data.jobPositions.length} records`);

    const roles = await insertUniqueData('roles', data.roles, 'name');
    console.log(`Roles: ${data.roles.length} records`);

    // Get IDs for foreign keys
    const { data: deptMap } = await supabase.from('departments').select('id, name');
    const { data: locMap } = await supabase.from('locations').select('id, name');
    const { data: buMap } = await supabase.from('business_units').select('id, name');
    const { data: conMap } = await supabase.from('contractors').select('id, name');
    const { data: jpMap } = await supabase.from('job_positions').select('id, name');
    const { data: roleMap } = await supabase.from('roles').select('id, name');

    const deptIdMap = new Map((deptMap || []).map((d) => [d.name, d.id]));
    const locIdMap = new Map((locMap || []).map((l) => [l.name, l.id]));
    const buIdMap = new Map((buMap || []).map((b) => [b.name, b.id]));
    const conIdMap = new Map((conMap || []).map((c) => [c.name, c.id]));
    const jpIdMap = new Map((jpMap || []).map((j) => [j.name, j.id]));
    const roleIdMap = new Map((roleMap || []).map((r) => [r.name, r.id]));

    // Insert employees with foreign keys
    const employees = data.employees
      .filter(
        (e) =>
          e.payroll_no &&
          e.employee_name &&
          (e.employee_name as string).length > 0
      )
      .map((e) => ({
        payroll_no: e.payroll_no,
        employee_name: e.employee_name,
        department_id: deptIdMap.get(e.department_name) || null,
        location_id: locIdMap.get(e.location_name) || null,
        business_unit_id: buIdMap.get(e.business_unit_name) || null,
        contractor_id: conIdMap.get(e.contractor_name) || null,
        status: e.status || 'Active',
        job_position_id: jpIdMap.get(e.job_position_name) || null,
        email: e.email,
      }));

    try {
      const { error: empError } = await supabase
        .from('employees')
        .insert(employees);

      if (empError && empError.code === '23505') {
        // Update existing
        for (const emp of employees) {
          await supabase
            .from('employees')
            .update(emp)
            .eq('payroll_no', emp.payroll_no);
        }
        console.log(`✓ Updated ${employees.length} employees`);
      } else if (empError) {
        console.error('Error inserting employees:', empError);
      } else {
        console.log(`✓ Inserted ${employees.length} employees`);
      }
    } catch (err) {
      console.error('Error with employees:', err);
    }

    // Get employee IDs map
    const { data: empMap } = await supabase
      .from('employees')
      .select('id, email');
    const empIdMap = new Map((empMap || []).map((e) => [e.email, e.id]));

    // Insert users - only insert, don't try to reference auth.users yet
    const users = data.users
      .filter((u) => u.email && (u.email as string).length > 0)
      .map((u) => ({
        email: u.email,
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        role_id: roleIdMap.get(u.role_name) || null,
        employee_id: empIdMap.get(u.email) || null,
        is_admin: u.role_name?.toLowerCase().includes('admin') || false,
      }));

    try {
      // For users, we need to skip the id column since it references auth.users
      const { error: usersError } = await supabase.from('users').insert(
        users.map((u) => ({
          email: u.email,
          first_name: u.first_name,
          last_name: u.last_name,
          role_id: u.role_id,
          employee_id: u.employee_id,
          is_admin: u.is_admin,
        }))
      );

      if (usersError && usersError.code === '23505') {
        // Update existing
        for (const user of users) {
          await supabase
            .from('users')
            .update({
              first_name: user.first_name,
              last_name: user.last_name,
              role_id: user.role_id,
              employee_id: user.employee_id,
              is_admin: user.is_admin,
            })
            .eq('email', user.email);
        }
        console.log(`✓ Updated ${users.length} users`);
      } else if (usersError) {
        console.warn('Note: Users cannot be inserted without auth.users entries');
        console.warn('Error:', usersError.message);
      } else {
        console.log(`✓ Inserted ${users.length} users`);
      }
    } catch (err) {
      console.warn('Note: Some users could not be inserted (requires auth setup)');
    }

    console.log('\n✅ Data upload completed successfully!');
    console.log(`
Summary:
- Business Units: ${businessUnits?.length || 0}
- Departments: ${departments?.length || 0}
- Locations: ${locations?.length || 0}
- Work Areas: ${workAreas?.length || 0}
- Contractors: ${contractors?.length || 0}
- Designations: ${designations?.length || 0}
- Job Positions: ${jobPositions?.length || 0}
- Roles: ${roles?.length || 0}
- Employees: ${employees?.length || 0}
- Users: Requires Supabase Auth setup (will be created when users sign up)
    `);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
