# HSE Dashboard - Quick Start Guide

## What's Been Built

Your HSE (Health, Safety & Environment) Dashboard is now connected to Supabase with complete data integration and admin features. Here's what you have:

### ✅ Database
- 15 interconnected Supabase tables
- Row Level Security (RLS) policies for data protection
- Ready for your himaya1.zip data

### ✅ Authentication
- Email/password login at `/auth/login`
- Supabase Auth integration
- Session management

### ✅ Admin Features
- **Password Reset Tool**: `/admin/users-management`
- Admin-only access verification
- Reset user passwords inline

### ✅ Dashboard Pages
- Main dashboard with statistics
- Employee listing page
- Quick navigation links

## Getting Started (5 Steps)

### Step 1: Update Environment Variables
Edit `.env.local` with your **actual** Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get these from: https://app.supabase.com/projects/[your-project-id]/settings/api

### Step 2: Verify Database Tables
Check that all 15 tables were created:
1. Go to: https://app.supabase.com/projects/[your-project-id]/editor
2. You should see all tables listed on the left sidebar
3. All tables should have RLS enabled

### Step 3: Create First Admin User
In Supabase dashboard:

**Option A - Via SQL Editor:**
```sql
-- First, create auth user in Auth section
-- Then run this SQL to make them admin:

INSERT INTO public.users (id, email, is_admin, first_name, last_name) 
VALUES (
  '[user-uuid-from-auth]',
  'admin@example.com',
  true,
  'Admin',
  'User'
);
```

**Option B - Via Auth Dashboard:**
1. Go to Authentication → Users
2. Create a new user
3. Run the SQL above with their UUID

### Step 4: Load Your Data
Run the migration script to load himaya1.zip data:

```bash
# Make sure XLS files are in /tmp/himaya/
# Or update the path in scripts/migrate-data.ts

pnpm tsx scripts/migrate-data.ts
```

This will:
- Parse all XLS files
- Categorize data (Business Unit, Department, etc.)
- Insert into Supabase tables
- Skip duplicates automatically

### Step 5: Test the App
```bash
# Start dev server
pnpm dev

# Navigate to http://localhost:3000
# → Login at /auth/login with your admin user
# → Should see dashboard
# → Click "User Management" button to reset passwords
```

## Key URLs

| Feature | URL | Access |
|---------|-----|--------|
| Login | `/auth/login` | Public |
| Dashboard | `/dashboard` | Authenticated |
| Employees | `/dashboard/employees` | Authenticated |
| User Management | `/admin/users-management` | Admin Only |
| Auth Callback | `/auth/callback` | Internal |

## Features Overview

### Dashboard (`/dashboard`)
- Welcome message with user name
- 5 statistics cards (Employees, Departments, Vehicles, etc.)
- Quick links to other pages
- Admin tools section (visible to admins only)

### Employees (`/dashboard/employees`)
- Table view of all employees
- Payroll number, name, email, status
- Loaded from `employees` table

### User Management (`/admin/users-management`)
- List all system users
- Click "Reset Password" button
- Enter new password
- Confirm to reset
- Only admins can access

## File Structure

```
Key Files:
- /lib/auth-context.tsx         ← Authentication logic
- /lib/supabase/client.ts       ← Browser Supabase client
- /lib/supabase/server.ts       ← Server Supabase client
- /app/auth/login/page.tsx      ← Login form
- /app/dashboard/page.tsx       ← Main dashboard
- /app/admin/users-management/  ← Admin tools
- /api/admin/reset-password/    ← Password reset API

Data:
- scripts/migrate-data.ts       ← Load XLS files
- SUPABASE_SETUP.md             ← Full setup guide
- IMPLEMENTATION_SUMMARY.md     ← What was built
```

## Troubleshooting

### "Supabase URL and API key are required"
→ Check `.env.local` has correct values
→ Restart dev server: `pnpm dev`

### Migration fails to find XLS files
→ Update path in `scripts/migrate-data.ts` line 32
→ Or copy files to `/tmp/himaya/`

### Can't login
→ Verify user exists in Supabase Auth section
→ Check `public.users` table has matching record
→ Verify email matches exactly

### Password reset button not showing
→ Check user is marked as `is_admin = true` in `public.users`
→ Logout and login again
→ Check browser console for errors

## Database Tables Overview

| Table | Purpose | Records |
|-------|---------|---------|
| `business_units` | Organization units | From XLS |
| `departments` | Company departments | From XLS |
| `locations` | Office/site locations | From XLS |
| `employees` | Employee master data | From XLS |
| `users` | System users | Manual |
| `roles` | User roles | From XLS |
| `courses` | Training courses | From XLS |
| `training_records` | Employee training | From XLS |
| `fleet_vehicles` | Company vehicles | From XLS |
| `vehicle_inspections` | Inspection records | From XLS |
| `near_miss_observations` | Safety observations | From XLS |

## Next Steps

1. ✅ Update env variables
2. ✅ Create admin user
3. ✅ Run migration script
4. ✅ Test login
5. ⭕ **Optional**: Extend dashboard with more pages
   - Create Departments page
   - Add Training Records view
   - Build Fleet Management section
   - Add Near Miss Observations

## Security Notes

- ✅ All database tables have RLS enabled
- ✅ Only admins can reset passwords
- ✅ Passwords are hashed by Supabase
- ✅ Sessions managed securely
- ✅ No sensitive data in environment

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Next.js 16 Docs: https://nextjs.org/docs
- Repository: This project

---

**Ready to start?** 
1. Update `.env.local` with Supabase credentials
2. Create an admin user
3. Run `pnpm dev` and navigate to `http://localhost:3000/auth/login`
