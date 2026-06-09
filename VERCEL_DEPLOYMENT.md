# Vercel Deployment Guide

## Environment Variables Setup

To deploy the HSE Dashboard to Vercel, you need to configure the following environment variables:

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Settings → API**
3. Copy the following values:
   - **Project URL** (also called API URL)
   - **Anon Key** (public anon key)
   - **Service Role Key** (keep this secret!)

### Step 2: Add Environment Variables to Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Navigate to **Settings → Environment Variables**
3. Add the following variables:

#### Public Variables (visible in browser):
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL = https://your-vercel-domain.vercel.app/auth/callback
```

#### Secret Variables (server-only):
```
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
SUPABASE_JWT_SECRET = your-jwt-secret
POSTGRES_URL = your-postgres-url
```

### Step 3: Required Variables Reference

| Variable | Type | Description | Where to Find |
|----------|------|-------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Your Supabase project URL | Supabase Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Anonymous key for client-side auth | Supabase Settings → API → anon key |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Public | Redirect URL after auth | Your Vercel production URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Admin key for server operations | Supabase Settings → API → Service Role Key |
| `SUPABASE_JWT_SECRET` | Secret | JWT signing secret | Supabase Settings → API → JWT Secret |
| `POSTGRES_URL` | Secret | Database connection string | Supabase Settings → Database → Connection Pooler → PostgreSQL |

## Deployment Steps

### Option 1: Connect GitHub Repository (Recommended)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial HSE Dashboard"
git push origin main
```

2. In Vercel:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select the project
   - Click "Deploy"

3. Vercel will automatically detect Next.js configuration

### Option 2: Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel
```

### Option 3: Deploy from Git

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Connect GitHub and select repository
4. Vercel auto-deploys on every push

## Post-Deployment Configuration

### 1. Update Redirect URL
After Vercel deployment, update the redirect URL in Vercel:

```
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL = https://your-hse-dashboard.vercel.app/auth/callback
```

### 2. Update Supabase Auth Settings

1. Go to Supabase Project Settings → Authentication
2. Add your Vercel URL to **Redirect URLs**:
   - `https://your-hse-dashboard.vercel.app/auth/callback`
   - `https://your-hse-dashboard.vercel.app/auth/error`

### 3. Enable Supabase Features

In Supabase dashboard:
1. **Authentication** → Email Auth enabled
2. **Database** → RLS policies active
3. **Security** → SQL editor access configured

## Troubleshooting

### Issue: "Invalid API key" error
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Check that variables are marked as "Public" in Vercel

### Issue: "Auth callback failed"
- Ensure redirect URL matches exactly in Supabase settings
- Check NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL is set correctly

### Issue: "Database connection refused"
- Verify POSTGRES_URL is correct
- Check Supabase database is running
- Ensure IP whitelist allows Vercel IPs (usually automatic)

### Issue: "Password reset not working"
- Verify SUPABASE_SERVICE_ROLE_KEY is set as secret variable
- Check API route `/api/admin/reset-password` exists
- Enable admin API in Supabase settings

## Monitoring & Logs

### View Vercel Logs:
```bash
vercel logs
```

### View Supabase Logs:
1. Supabase Dashboard → Logs
2. Check SQL query logs
3. Monitor authentication events

## Security Checklist

- [ ] All secret keys are in Vercel as "Secret" variables
- [ ] Service Role Key never exposed in client code
- [ ] JWT Secret matches between Vercel and Supabase
- [ ] CORS configured correctly in Supabase
- [ ] RLS policies enabled on all tables
- [ ] Redirect URLs whitelist is configured
- [ ] Production database has backups enabled

## Rollback & Updates

### Revert to Previous Version:
1. In Vercel Dashboard → Deployments
2. Click on previous deployment
3. Click "Redeploy"

### Update Environment Variables:
1. Change variable in Vercel Settings
2. Go to Deployments → Redeploy Latest
3. Changes take effect immediately

## Performance Tips

1. **Enable Caching**: Supabase queries are cached with SWR
2. **Use Connection Pooling**: Vercel automatically pools DB connections
3. **Monitor Response Times**: Use Vercel Analytics
4. **Database Indexing**: All key columns are indexed

## Next Steps

1. Deploy to Vercel
2. Test admin password reset feature
3. Verify all employees load correctly
4. Configure team access in Vercel
5. Set up error monitoring (Sentry optional)
