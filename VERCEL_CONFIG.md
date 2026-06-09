# Configuration Files for Vercel Deployment

This directory contains all necessary configuration for deploying the HSE Dashboard to Vercel with Supabase.

## 📋 Configuration Files

### Environment Configuration
- **`.env.example`** - Template for all required environment variables
- **`.env.local`** - Your local development environment (git-ignored)
- **`vercel.json`** - Vercel-specific build and deployment settings

### Documentation Files
1. **`DEPLOYMENT_READY.md`** ⭐ **START HERE** - Quick overview and deployment checklist
2. **`VERCEL_DEPLOYMENT.md`** - Comprehensive deployment guide
3. **`VERCEL_SUPABASE_INTEGRATION.md`** - Technical integration details
4. **`QUICK_START.md`** - Local development setup
5. **`ADMIN_PASSWORD_RESET.md`** - Admin feature documentation
6. **`README.md`** - Project overview
7. **`setup-env.sh`** - Interactive environment setup script

### Code Configuration
- **`next.config.mjs`** - Next.js configuration
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.ts`** - Tailwind CSS configuration
- **`postcss.config.mjs`** - PostCSS configuration

### Data Files
- **`scripts/load-data.ts`** - Script to load Excel data into Supabase
- **`DATA_UPLOAD_SUMMARY.md`** - Summary of uploaded data

## 🚀 Quick Start for Vercel Deployment

### 1. Read Documentation (2 minutes)
Start with `DEPLOYMENT_READY.md` for a quick overview.

### 2. Get Credentials (5 minutes)
- Go to https://app.supabase.com
- Copy your Project URL, Anon Key, and Service Role Key

### 3. Deploy (2 minutes)
```bash
# Option A: GitHub (Recommended)
git push
→ vercel.com/new
→ Import repository

# Option B: CLI
vercel --prod
```

### 4. Configure Variables (5 minutes)
Add to Vercel Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Secret)
- `SUPABASE_JWT_SECRET` (Secret)
- `POSTGRES_URL` (Secret)
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

## 📁 Project Structure

```
hse-dashboard/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Auth Provider
│   ├── page.tsx                 # Home page
│   ├── auth/                    # Authentication pages
│   │   ├── login/page.tsx       # Login page
│   │   ├── callback/route.ts    # Auth callback
│   │   └── error/page.tsx       # Auth error
│   ├── api/                     # API routes
│   │   └── admin/reset-password/ # Password reset API
│   ├── admin/                   # Admin pages
│   │   └── users-management/    # User management
│   └── dashboard/               # Main dashboard
│       ├── page.tsx             # Dashboard home
│       └── employees/page.tsx   # Employee listing
│
├── lib/                         # Utilities and services
│   ├── supabase/               # Supabase clients
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── proxy.ts            # Proxy handler
│   ├── auth-context.tsx        # Auth context provider
│   ├── data-service.ts         # Database queries
│   └── use-fetch-data.ts       # Data fetching hook
│
├── components/                  # React components
│   └── ui/                      # shadcn UI components
│
├── scripts/
│   └── load-data.ts            # Data migration script
│
├── middleware.ts               # Auth middleware
├── next.config.mjs             # Next.js config
├── vercel.json                 # Vercel config
├── .env.example                # Environment template
└── package.json                # Dependencies
```

## 🔐 Environment Variables

### Development (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SUPABASE_JWT_SECRET=your-jwt-secret
POSTGRES_URL=postgresql://...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Production (Vercel Settings)
Same as above, but:
- Update `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` to your Vercel URL
- Mark server secrets with **Secret** type

## 📊 Data Loaded

The application has 703 records loaded from Excel files:
- 376 Employees
- 119 Job Positions
- 99 Designations
- 54 Departments
- 13 Locations
- 12 Business Units
- 16 Work Areas
- 10 Roles
- 4 Contractors

All data is accessible through the dashboard with proper authentication.

## ✅ Pre-Deployment Checklist

- [ ] Read `DEPLOYMENT_READY.md`
- [ ] Have Supabase credentials ready
- [ ] GitHub repo created and pushed
- [ ] All environment variables identified
- [ ] Vercel account ready
- [ ] Supabase auth URLs configured
- [ ] Build passes locally: `pnpm build`

## 🔗 Important Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Your App URL**: Will be `https://your-project.vercel.app`
- **Admin Panel**: `https://your-project.vercel.app/admin/users-management`

## 🆘 Troubleshooting

### Build Fails
```bash
pnpm install
pnpm build
```

### Auth Not Working
- Check `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` matches exactly
- Verify Supabase auth URLs configured
- Check environment variables in Vercel

### Database Connection Error
- Verify `POSTGRES_URL` is correct
- Check Supabase project status
- Test locally with same credentials

### Password Reset Returns 401
- Verify `SUPABASE_SERVICE_ROLE_KEY` is marked as Secret
- Check user has admin role
- Review API logs

## 📞 Support

- See `VERCEL_DEPLOYMENT.md` for detailed deployment help
- See `VERCEL_SUPABASE_INTEGRATION.md` for technical details
- Check Vercel logs: `vercel logs`

## 🎯 Next Steps

1. Review `DEPLOYMENT_READY.md` (this will take 2 minutes)
2. Gather your Supabase credentials
3. Deploy to Vercel using Quick Start section
4. Test the application
5. Monitor logs for first 24 hours

**Total time to deployment: ~12 minutes**

Good luck! 🚀
