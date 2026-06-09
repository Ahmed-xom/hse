#!/bin/bash

# HSE Dashboard - Vercel Environment Setup Script

echo "========================================="
echo "HSE Dashboard - Vercel Setup"
echo "========================================="
echo ""

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Would you like to overwrite it? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        echo "Cancelled. Using existing .env.local"
        exit 0
    fi
fi

echo ""
echo "Please gather your Supabase credentials from:"
echo "https://app.supabase.com/project/[YOUR-PROJECT-ID]/settings/api"
echo ""

# Collect user input
read -p "Enter your NEXT_PUBLIC_SUPABASE_URL (e.g., https://xxxx.supabase.co): " SUPABASE_URL
read -p "Enter your NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
read -p "Enter your SUPABASE_SERVICE_ROLE_KEY: " SERVICE_ROLE_KEY
read -p "Enter your SUPABASE_JWT_SECRET: " JWT_SECRET
read -p "Enter your POSTGRES_URL: " POSTGRES_URL

# Validate inputs
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: Missing required values"
    exit 1
fi

# Create .env.local
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
SUPABASE_JWT_SECRET=$JWT_SECRET
POSTGRES_URL=$POSTGRES_URL

# Auth Redirect URLs
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# For production, update to:
# NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-hse-dashboard.vercel.app/auth/callback
EOF

echo ""
echo "✅ .env.local created successfully!"
echo ""
echo "Next steps:"
echo "1. Start dev server: pnpm dev"
echo "2. Test the application at http://localhost:3000"
echo "3. For Vercel deployment, add these variables to Vercel Settings:"
echo "   - NEXT_PUBLIC_SUPABASE_URL (Public)"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY (Public)"
echo "   - SUPABASE_SERVICE_ROLE_KEY (Secret)"
echo "   - SUPABASE_JWT_SECRET (Secret)"
echo "   - POSTGRES_URL (Secret)"
echo ""
echo "See VERCEL_DEPLOYMENT.md for complete instructions"
