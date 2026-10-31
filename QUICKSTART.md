# Quick Start Guide

Get your Exam Builder app running in 10 minutes!

## Step 1: Supabase Setup (5 minutes)

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - Name: `exam-builder`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Click "Create new project"
5. Wait 2-3 minutes for setup

### Setup Database

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `SUPABASE_SETUP.sql`
4. Click "Run" or press Ctrl+Enter
5. You should see "Success. No rows returned" - that's perfect!

### Get API Keys

1. Go to **Project Settings** (gear icon) > **API**
2. Copy these values:
   - Project URL
   - anon public key

### Configure Authentication

1. Go to **Authentication** > **URL Configuration**
2. Set Site URL: `http://localhost:3000`
3. Add Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000`

### (Optional) Enable Google OAuth

1. Go to **Authentication** > **Providers**
2. Enable Google
3. Follow the setup guide
4. Add your OAuth credentials from Google Cloud Console

## Step 2: Local Setup (3 minutes)

### Configure Environment

1. Create `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Paste your Supabase URL and anon key

### Dependencies Are Already Installed!

If not, run:
```bash
npm install
```

## Step 3: Run the App (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 4: Test It Out!

### Create Account

1. Click "Sign Up"
2. Enter your details:
   - Full Name
   - Email
   - Password (min 6 characters)
3. Click "Sign Up"
4. Check your email for verification link
5. Click the link to verify

**OR**

1. Click "Continue with Google"
2. Sign in with your Google account

### Explore Features

Once signed in:
- ✅ View the dashboard
- ✅ Create a database
- ✅ Change theme (light/dark/system)
- ✅ Adjust brightness
- ✅ Edit your profile
- ✅ Change password
- ✅ Configure sharing settings

## Troubleshooting

### "Invalid redirect URL"

**Problem:** Supabase redirect error after OAuth

**Solution:**
1. Check Supabase > Authentication > URL Configuration
2. Ensure `http://localhost:3000/auth/callback` is added
3. Wait 2-3 minutes for changes to propagate
4. Clear browser cache and try again

### "Failed to fetch"

**Problem:** Can't connect to Supabase

**Solution:**
1. Verify `.env.local` has correct values
2. Check no extra spaces in environment variables
3. Restart dev server: `Ctrl+C` then `npm run dev`
4. Check Supabase project is active (not paused)

### Email verification not working

**Problem:** Not receiving verification emails

**Solution:**
1. Check spam folder
2. In Supabase > Authentication > Email Templates, verify email is configured
3. For development, you can disable email confirmation:
   - Go to Authentication > Providers > Email
   - Uncheck "Confirm email"

### Database tables not created

**Problem:** Can't sign up or get database errors

**Solution:**
1. Run the SQL setup again in Supabase SQL Editor
2. Check Table Editor to verify tables exist:
   - profiles
   - databases
   - exams
   - shared_databases

### Port 3000 already in use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Stop other processes using port 3000, or use a different port
npm run dev -- -p 3001
```

Then open [http://localhost:3001](http://localhost:3001)

## Next Steps

### Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to:
- Vercel (recommended)
- Netlify
- Custom server

### Customize the App

Key files to modify:
- `app/globals.css` - Styling and colors
- `tailwind.config.js` - Theme colors
- `lib/store.ts` - App state
- `components/` - UI components

### Add Features

Check `README.md` for the features roadmap and how to extend the app.

## Support

Need help?
- 📧 Email: osilajaolamiposi18@gmail.com
- 📖 Full docs: [README.md](README.md)
- 🚀 Deployment: [DEPLOYMENT.md](DEPLOYMENT.md)

## Quick Reference

### Important URLs

- **Supabase Dashboard:** https://app.supabase.com
- **Local App:** http://localhost:3000
- **Documentation:** Inside this folder

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check TypeScript errors
npm run lint
```

### File Structure

```
exam-builder/
├── app/              # Pages and routes
├── components/       # Reusable UI components
├── lib/             # Utilities (auth, database, state)
├── public/          # Static files
└── .env.local       # Environment variables (create this!)
```

---

**You're all set! 🎉** Your Exam Builder app should now be running on http://localhost:3000
