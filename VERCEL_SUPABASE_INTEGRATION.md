# Vercel + Supabase Integration Guide

## Overview

This guide explains how to connect your HSE Dashboard to Vercel with Supabase database integration.

## Architecture

```
┌─────────────┐
│   Vercel    │ (Hosting)
│  (Next.js)  │
└─────┬───────┘
      │
      │ HTTPS
      │
┌─────▼──────────────┐
│   Supabase         │
│ ┌────────────────┐ │
│ │ PostgreSQL DB  │ │ (Database + Auth)
│ │   + Auth       │ │
│ └────────────────┘ │
└────────────────────┘
```

## Prerequisites

1. **Vercel Account**: https://vercel.com/signup
2. **Supabase Project**: Already created with HSE data loaded
3. **GitHub Account** (optional but recommended for auto-deployment)

## Step 1: Prepare Your Supabase Project

### 1.1 Get Your API Credentials

1. Go to Supabase: https://app.supabase.com
2. Select your project
3. Go to **Settings → API** and note:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon Key** (public key for client)
   - **Service Role Key** (secret key for server)
   - **JWT Secret** (for token validation)

### 1.2 Configure Auth Redirect URLs

In Supabase:
1. Go to **Authentication → URL Configuration**
2. Add these redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-app-name.vercel.app/auth/callback` (production)

### 1.3 Verify Database Connection

In Supabase:
1. Go to **Settings → Database**
2. Copy the **Connection Pooler** PostgreSQL URL
3. This is your `POSTGRES_URL`

## Step 2: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "HSE Dashboard ready for deployment"
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - After import, Vercel will ask for variables
   - Add all variables from the table below

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app is live!

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add SUPABASE_JWT_SECRET
   vercel env add POSTGRES_URL
   ```

5. **Redeploy**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

Add these to Vercel Settings → Environment Variables:

### Public Variables (Client-side)
These are visible in the browser - that's OK, they're limited in what they can do.

| Name | Value | Example |
|------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | `https://abcxyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | `eyJhbGciOi...` |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Your Vercel URL + `/auth/callback` | `https://hse-dashboard.vercel.app/auth/callback` |

### Secret Variables (Server-side only)
These are hidden from the browser - keep them secure!

| Name | Value | Where to Find |
|------|-------|---------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Your Service Role Key | Supabase Settings → API |
| `SUPABASE_JWT_SECRET` | Your JWT Secret | Supabase Settings → API |
| `POSTGRES_URL` | Database Connection URL | Supabase Settings → Database → Connection Pooler |

## Step 4: Verify Deployment

1. **Check Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Verify "Latest Deployment" is successful

2. **Test the Application**
   - Visit your Vercel URL: `https://your-hse-dashboard.vercel.app`
   - Should see login page
   - Test login functionality

3. **Test Admin Features**
   - Login as admin user
   - Go to `/admin/users-management`
   - Test password reset button

4. **Check Logs**
   - In Vercel: Deployments → Your Deployment → Logs
   - Look for any errors

## Step 5: Post-Deployment Configuration

### Update Supabase Auth Settings

In Supabase:
1. **Authentication → URL Configuration**
   - Update redirect URL to production URL
   - Format: `https://your-domain.vercel.app/auth/callback`

2. **Email Authentication**
   - Go to **Authentication → Email Templates**
   - Update sender email if needed

3. **CORS Configuration**
   - Go to **Settings → API → CORS Allowed Origins**
   - Add your Vercel domain

## Step 6: Enable Auto-Deployment

To automatically deploy when you push code to GitHub:

1. In Vercel Dashboard → Settings → Git
2. Ensure "Automatically deploy on push" is enabled
3. Any push to main branch will trigger deployment

## Environment Variables Reference

### Development (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_JWT_SECRET=your-secret
POSTGRES_URL=postgresql://...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Production (Vercel Settings)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co (Public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (Public)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (Secret)
SUPABASE_JWT_SECRET=your-secret (Secret)
POSTGRES_URL=postgresql://... (Secret)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-app.vercel.app/auth/callback (Public)
```

## Troubleshooting

### Deployment Fails with "Missing Environment Variables"
**Solution**: Add all required variables to Vercel before deploying
```bash
vercel env ls  # Check what's set
vercel env add VARIABLE_NAME  # Add missing ones
```

### Auth Redirect Loop
**Problem**: Cannot login, stuck in redirect loop
**Solution**: 
1. Verify `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` matches Supabase auth settings exactly
2. Ensure URL includes `/auth/callback`
3. No trailing slash

### Database Connection Refused
**Problem**: Cannot connect to Supabase database
**Solution**:
1. Verify `POSTGRES_URL` is correct
2. Check Supabase project is running (not paused)
3. Verify network settings allow Vercel IPs
4. Test locally first with same URL

### Password Reset Not Working
**Problem**: Admin password reset button doesn't work
**Solution**:
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set (must be Secret, not Public)
2. Check API route exists: `/api/admin/reset-password`
3. Verify admin user has correct role in database
4. Check Vercel logs for API errors

### 404 on Auth Pages
**Problem**: Login page returns 404
**Solution**:
1. Verify build completed successfully in Vercel logs
2. Check that all auth files exist: `/app/auth/login/page.tsx`
3. Redeploy: `vercel --prod`

## Performance Optimization

### Database Connection Pooling
Supabase automatically pools connections. For best performance:
1. Use Connection Pooler URL (not direct URL)
2. Keep connection pool size reasonable
3. Vercel scales automatically with connections

### Caching Strategy
- All data fetches use SWR for automatic caching
- Set `revalidate: 60` on server components for 60 second cache
- Employee data cached 5 minutes by default

### Monitoring Performance
In Vercel Dashboard:
1. Go to Analytics tab
2. Monitor:
   - Response Times
   - Edge Network
   - Server Functions

## Security Checklist

Before going to production:
- [ ] All Secret keys are marked as "Secret" in Vercel
- [ ] No API keys in code or `.env.local`
- [ ] RLS policies enabled on all tables in Supabase
- [ ] Redirect URLs properly configured
- [ ] CORS whitelist includes only your domain
- [ ] Database backups enabled in Supabase
- [ ] Strong password policy in Supabase Auth

## Next Steps

1. **Test thoroughly** in production
2. **Monitor logs** for errors: `vercel logs`
3. **Set up error tracking** (optional): Sentry, Datadog
4. **Configure domains** if you have custom domain
5. **Enable analytics** in Vercel for performance data

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Troubleshooting**: See VERCEL_DEPLOYMENT.md

## Useful Commands

```bash
# View deployment status
vercel

# Check environment variables
vercel env ls

# View logs
vercel logs

# Rollback to previous version
vercel rollback

# Set new environment variable
vercel env add VARIABLE_NAME

# Remove variable
vercel env rm VARIABLE_NAME
```
