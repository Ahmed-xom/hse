# HSE Dashboard - Supabase Integration Guide

## Setup Instructions

### 1. Database Schema
The database schema has been created automatically with the following tables:
- `business_units` - Organization business units
- `departments` - Department information
- `locations` - Location/site information
- `jobs_positions` - Job position hierarchy
- `designations` - Employee designations
- `contractors` - Contractor information
- `work_areas` - Work area definitions
- `roles` - System roles (Admin, Manager, Viewer)
- `employees` - Employee master data
- `users` - System users linked to auth.users
- `courses` - Training courses
- `training_records` - Employee training records
- `fleet_vehicles` - Company vehicles
- `vehicle_inspections` - Vehicle inspection records
- `near_miss_observations` - Safety observations

### 2. Data Migration

The project includes a migration script to load data from the himaya1.zip XLS files into Supabase.

#### Before Running Migration:

1. Ensure you have the `.env.local` file with Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

2. Place the himaya XLS files in `/tmp/himaya/` directory (or update the script path)

#### Running the Migration:

```bash
# Using pnpm
pnpm tsx scripts/migrate-data.ts

# Or using npx
npx tsx scripts/migrate-data.ts
```

The script will:
- Parse all XLS files from the himaya directory
- Extract data categories (Business Unit, Department, Location, etc.)
- Insert data into the corresponding Supabase tables
- Skip duplicate entries

### 3. Authentication

The app uses Supabase Auth with the following features:
- Email/password authentication
- User profile management
- Admin role-based access control
- Session management

#### Creating Admin Users:

Admin users need to be created manually in Supabase or through the admin API:

1. Create a user in Supabase Auth
2. Insert a corresponding record in the `users` table with `is_admin = true`

### 4. Admin Features

#### Reset Password Button
Located at: `/admin/users-management`

- Only accessible to admin users
- View all system users
- Reset any user's password
- Set a new password for selected users
- Admin verification prevents unauthorized password resets

### 5. File Structure

```
app/
  admin/
    users-management/
      page.tsx              - User management dashboard
  auth/
    login/
      page.tsx              - Login page
    callback/
      route.ts              - Auth callback route (required)
  dashboard/
    page.tsx                - Main dashboard
    employees/
      page.tsx              - Employees list
lib/
  supabase/
    client.ts               - Browser Supabase client
    server.ts               - Server Supabase client
    proxy.ts                - Proxy session handling
  auth-context.tsx          - Authentication context provider
  data-service.ts           - Server-side data fetching
  use-fetch-data.ts         - Client-side data fetching hook
scripts/
  migrate-data.ts           - Data migration script
  create-schema.sql         - Database schema creation
```

### 6. Key Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL              - Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY         - Supabase anonymous key (public)
SUPABASE_SERVICE_ROLE_KEY             - Service role key (private, for admin operations)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL - (Optional) Dev environment redirect URL
```

### 7. Row Level Security (RLS)

All tables have RLS enabled with the following policies:
- **Public Read**: Authenticated users can read most tables
- **User Management**: Only admins can manage users
- **Self Service**: Users can view their own profile

### 8. Features

#### Dashboard
- View key statistics (employees, departments, vehicles, etc.)
- Quick links to common features
- Admin tools access for administrators

#### User Management (Admin Only)
- View all system users
- Reset user passwords
- User role management
- Disable/enable users

#### Data Access
- Real-time data synchronization
- Server-side data fetching for performance
- Client-side caching and updates

### 9. Troubleshooting

#### Migration Issues
- Ensure XLS files are properly formatted
- Check that all required columns are present
- Verify Supabase connection and permissions

#### Authentication Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys are correct
- Check that Supabase Auth is enabled
- Ensure users exist in both auth.users and public.users tables

#### Permission Issues
- Check RLS policies are correctly configured
- Verify user has appropriate role assigned
- Confirm admin flag is set for admin operations

### 10. Next Steps

1. Run the data migration to load your employee data
2. Create admin users through Supabase dashboard
3. Access the dashboard at `/dashboard`
4. Use admin tools to manage users and reset passwords

## Support

For issues or questions, refer to:
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
