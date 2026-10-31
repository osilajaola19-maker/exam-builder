# Setup Checklist ✅

Follow this checklist to get your Exam Builder app running. Check off each item as you complete it.

## Phase 1: Supabase Setup (Required)

### Create Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Create new account or sign in
- [ ] Click "New Project"
- [ ] Name: "exam-builder"
- [ ] Choose region closest to you
- [ ] Create strong database password (save it!)
- [ ] Wait for project to finish initializing (~2 minutes)

### Setup Database
- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor (left sidebar)
- [ ] Click "New query"
- [ ] Open `SUPABASE_SETUP.sql` from your project
- [ ] Copy entire file contents
- [ ] Paste into SQL Editor
- [ ] Click "Run" button
- [ ] Verify you see "Success. No rows returned"
- [ ] Go to Table Editor
- [ ] Confirm you see these tables:
  - [ ] profiles
  - [ ] databases
  - [ ] exams
  - [ ] shared_databases

### Get API Credentials
- [ ] Go to Project Settings (gear icon)
- [ ] Click on "API" in the left menu
- [ ] Copy "Project URL" (save for later)
- [ ] Copy "anon public" key (save for later)

### Configure Authentication
- [ ] Go to Authentication > URL Configuration
- [ ] Site URL: `http://localhost:3000`
- [ ] Add to Redirect URLs:
  - [ ] `http://localhost:3000/auth/callback`
  - [ ] `http://localhost:3000`
- [ ] Click "Save"

### Email Provider (Required)
- [ ] Go to Authentication > Providers
- [ ] Ensure "Email" is enabled
- [ ] Check "Confirm email" if you want email verification
- [ ] For testing, you can uncheck "Confirm email"

### Google OAuth (Optional)
- [ ] Go to Authentication > Providers
- [ ] Click on "Google"
- [ ] Enable Google provider
- [ ] Need Google OAuth credentials? Follow Supabase guide
- [ ] Add OAuth credentials
- [ ] Save

## Phase 2: Local Setup

### Environment Configuration
- [ ] Open project folder
- [ ] Create new file named `.env.local`
- [ ] Add these lines:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_project_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  ```
- [ ] Replace `your_project_url` with your actual URL
- [ ] Replace `your_anon_key` with your actual key
- [ ] Save the file

### Verify Dependencies
- [ ] Dependencies should already be installed
- [ ] If not, run: `npm install`
- [ ] Wait for installation to complete

## Phase 3: Run Application

### Start Development Server
- [ ] Open terminal in project folder
- [ ] Run: `npm run dev`
- [ ] Wait for "Ready" message
- [ ] Should say something like: "Local: http://localhost:3000"

### Open Application
- [ ] Open browser
- [ ] Go to: http://localhost:3000
- [ ] Should see the sign-in page with animated background

## Phase 4: Test Features

### Test Sign Up (Email)
- [ ] Click "Sign Up" button
- [ ] Fill in:
  - [ ] Full Name
  - [ ] Email address
  - [ ] Password (min 6 characters)
  - [ ] Confirm Password
- [ ] Click "Sign Up"
- [ ] If email verification is ON:
  - [ ] Check your email inbox
  - [ ] Click verification link
  - [ ] You'll be redirected to dashboard
- [ ] If email verification is OFF:
  - [ ] Should go straight to dashboard

### Test Sign In (Email)
- [ ] Go back to sign-in page
- [ ] Enter your email and password
- [ ] Click "Sign In"
- [ ] Should see loading animation
- [ ] Should redirect to dashboard

### Test Sign In (Google) - If Configured
- [ ] Click "Continue with Google"
- [ ] Select your Google account
- [ ] Authorize the app
- [ ] Should redirect to dashboard

### Test Dashboard
- [ ] Verify you see your name in top right
- [ ] Click notification bell icon (should open dropdown)
- [ ] Click theme icon (should show brightness slider)
- [ ] Move brightness slider (screen should adjust)
- [ ] Type in search bar (should be responsive)
- [ ] Click "Create Database" button
- [ ] Enter database name
- [ ] Click "Create"
- [ ] Verify database card appears

### Test Sidebar
- [ ] Click hamburger menu (if on mobile)
- [ ] Verify sidebar shows
- [ ] Click on "Profile"
- [ ] Should go to profile page
- [ ] Click on "Settings" (should expand)
- [ ] Click "Theme" (should go to theme page)
- [ ] Click "Password" (should go to password page)
- [ ] Click "Sharing" (should go to sharing page)

### Test Profile
- [ ] On profile page
- [ ] Click "Edit" icon next to name
- [ ] Change your name
- [ ] Click checkmark to save
- [ ] Verify name updates in sidebar

### Test Theme Settings
- [ ] Go to Settings > Theme
- [ ] Click "Light Mode" (UI should change)
- [ ] Click "Dark Mode" (UI should change)
- [ ] Click "System" (should match your OS setting)
- [ ] Click different accent colors
- [ ] Verify colors change throughout the app

### Test Password Change
- [ ] Go to Settings > Password
- [ ] Enter current password
- [ ] Enter new password
- [ ] Confirm new password
- [ ] Click "Update Password"
- [ ] Check your email for confirmation
- [ ] Verify you can sign in with new password

### Test Sharing
- [ ] Go to Settings > Sharing
- [ ] Select "Readable Only"
- [ ] Click "Generate Link"
- [ ] Verify link appears
- [ ] Click copy button
- [ ] Open incognito window
- [ ] Paste link (should work when implemented)

### Test Logout
- [ ] Click "Logout" in sidebar
- [ ] Should redirect to sign-in page
- [ ] Sign in again
- [ ] Verify all your data is still there

## Phase 5: Deployment (Optional)

### Prepare for Deployment
- [ ] Commit all changes to Git
- [ ] Push to GitHub repository
- [ ] Ensure `.env.local` is NOT committed (check `.gitignore`)

### Deploy to Vercel
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign in with GitHub
- [ ] Click "Add New Project"
- [ ] Select your exam-builder repository
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Click "Deploy"
- [ ] Wait for deployment (~2 minutes)
- [ ] Click on deployment URL
- [ ] Test the live site!

### Update Supabase for Production
- [ ] Go back to Supabase Dashboard
- [ ] Go to Authentication > URL Configuration
- [ ] Add your Vercel URL to:
  - [ ] Site URL: `https://your-app.vercel.app`
  - [ ] Redirect URLs: `https://your-app.vercel.app/auth/callback`
- [ ] Save changes
- [ ] Test authentication on production site

## Troubleshooting Checklist

If something doesn't work, check:

### Connection Issues
- [ ] `.env.local` file exists and has correct values
- [ ] No extra spaces in environment variables
- [ ] Supabase project is active (not paused)
- [ ] Development server is running
- [ ] No firewall blocking localhost:3000

### Authentication Issues
- [ ] Supabase redirect URLs are configured
- [ ] Email provider is enabled in Supabase
- [ ] For Google: OAuth credentials are correct
- [ ] Check browser console for errors
- [ ] Clear browser cache and cookies

### Database Issues
- [ ] SQL setup script ran successfully
- [ ] All tables exist in Table Editor
- [ ] RLS policies are enabled
- [ ] User has proper permissions

### Build/Compile Issues
- [ ] All dependencies installed (`node_modules` folder exists)
- [ ] No TypeScript errors (`npm run lint`)
- [ ] Node.js version is 18+ (`node --version`)
- [ ] Try deleting `node_modules` and `.next` folders
- [ ] Run `npm install` again
- [ ] Run `npm run dev` again

## Success Criteria ✨

You've successfully set up the app when:
- ✅ You can sign up and sign in
- ✅ Dashboard loads with your data
- ✅ You can create databases
- ✅ Theme switching works
- ✅ Profile editing works
- ✅ Password can be changed
- ✅ Sharing settings are accessible
- ✅ All navigation works smoothly
- ✅ Logout and login again shows same data

## Need Help?

If you're stuck:
1. Check `QUICKSTART.md` for detailed instructions
2. Check `README.md` for troubleshooting
3. Review error messages in:
   - Browser console (F12)
   - Terminal where dev server is running
   - Supabase Dashboard > Logs
4. Email: osilajaolamiposi18@gmail.com

## What's Next?

After completing this checklist:
- [ ] Read `PROJECT_SUMMARY.md` to understand what's built
- [ ] Read `DEPLOYMENT.md` for production deployment
- [ ] Customize the app for your needs
- [ ] Start building additional features!

---

**Estimated Setup Time:** 15-20 minutes for first-time setup

**Status Tracking:**
- Total Items: Count the checkboxes above
- Completed: Check off as you go
- You're making progress! 🎉
