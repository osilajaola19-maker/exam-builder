# Deployment Guide

## Deploy to Vercel (Recommended)

### Step 1: Prepare Your Code

1. Make sure all your code is committed to Git:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Push to GitHub:
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/exam-builder.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `exam-builder` repository
4. Configure your project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

6. Click "Deploy"

### Step 3: Configure Supabase for Production

1. In Supabase Dashboard > Authentication > URL Configuration
2. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

3. For Google OAuth, update your Google Cloud Console:
   - Authorized redirect URIs: Add your Vercel URL

## Deploy to Other Platforms

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

### Custom Server (VPS/Cloud)

```bash
# Build the app
npm run build

# Start production server
npm start
```

For PM2 (process manager):
```bash
npm install -g pm2
pm2 start npm --name "exam-builder" -- start
pm2 save
pm2 startup
```

## Post-Deployment Checklist

- [ ] Test authentication flow
- [ ] Verify Google OAuth works
- [ ] Test email verification
- [ ] Check all pages load correctly
- [ ] Test mobile responsiveness
- [ ] Verify database operations
- [ ] Test sharing functionality
- [ ] Check theme switching
- [ ] Test password reset flow

## Troubleshooting

### Authentication Issues

If you get "Invalid redirect URL":
1. Check Supabase > Authentication > URL Configuration
2. Ensure your production URL is added
3. Wait 2-3 minutes for changes to propagate

### Database Connection Issues

If data isn't loading:
1. Check environment variables are set correctly
2. Verify Supabase RLS policies are active
3. Check browser console for errors

### Build Failures

Common issues:
- Missing environment variables
- TypeScript errors (run `npm run build` locally first)
- Dependency issues (delete node_modules and package-lock.json, then `npm install`)

## Domain Setup

### Custom Domain on Vercel

1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update Supabase redirect URLs with new domain

## Performance Optimization

### Enable Caching

Vercel automatically handles caching for Next.js apps.

### Image Optimization

Images are automatically optimized by Next.js Image component.

### Analytics

Add Vercel Analytics:
```bash
npm install @vercel/analytics
```

Then in `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Monitoring

### Vercel Dashboard

Monitor:
- Deployment status
- Build logs
- Runtime logs
- Performance metrics

### Supabase Dashboard

Monitor:
- Database usage
- API calls
- Authentication events
- Storage usage

## Backup Strategy

### Database Backups

Supabase Pro includes:
- Daily automated backups
- Point-in-time recovery
- Export database manually from dashboard

### Code Backups

- GitHub repository (version controlled)
- Vercel deployment history

## Security Checklist

- [ ] Environment variables are secure (never commit .env files)
- [ ] Supabase RLS policies are properly configured
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] API keys are using the anon key (not service role key)
- [ ] CORS is properly configured in Supabase
- [ ] Rate limiting is enabled (Supabase includes this)

## Scaling Considerations

### Supabase Limits (Free Tier)

- 500MB database space
- 1GB file storage
- 50,000 monthly active users
- 2GB bandwidth

Upgrade to Pro when needed.

### Vercel Limits (Hobby Tier)

- 100GB bandwidth per month
- 100 deployments per day
- Unlimited websites

Upgrade to Pro for commercial use.

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review this documentation
4. Contact support: osilajaolamiposi18@gmail.com
