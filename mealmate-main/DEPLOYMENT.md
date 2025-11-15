# MealMate Production Deployment Guide

## Prerequisites

- Node.js 18+ and npm/bun
- Supabase project (already configured)
- Domain name (optional, for custom domain)

## Environment Setup

### 1. Environment Variables

Create `.env.local` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

These are already configured in your project.

### 2. Database Setup

All migrations have been applied:
- Core schema with RLS policies
- Helper functions and triggers
- Audit logging system
- Seed data for testing

### 3. Authentication Configuration

In Supabase Dashboard:
1. Go to Authentication > Settings
2. Configure Site URL: `https://yourdomain.com`
3. Add Redirect URLs for development: `http://localhost:8080`
4. Email templates are pre-configured

## Build & Deploy

### Production Build

```bash
npm run build
```

This creates optimized production assets in `dist/` folder.

### Performance Optimizations Included

1. **Code Splitting**: Automatic route-based splitting
2. **React Query Caching**: 5-minute stale time, intelligent refetching
3. **Service Worker**: Offline support and asset caching
4. **Image Optimization**: WebP support, lazy loading ready
5. **Bundle Size**: Optimized with tree-shaking

### Deployment Options

#### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

#### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option 3: Custom Server

Build and serve:
```bash
npm run build
npx serve -s dist -p 3000
```

## Post-Deployment Checklist

### 1. Verify Authentication
- Test login/signup flow
- Check email delivery
- Verify role-based access control

### 2. Test Real-time Features
- Meal confirmation counts update live
- Notifications appear in real-time
- No connection drops

### 3. Performance Monitoring

Add Sentry for error tracking:

```bash
npm install @sentry/react
```

Configure in `main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### 4. Database Backup

Enable Point-in-Time Recovery in Supabase:
1. Go to Database > Backups
2. Enable daily backups
3. Set retention period (7-30 days)

### 5. Security Headers

Add to your hosting platform:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 6. Rate Limiting

Supabase handles this automatically, but for additional protection:
- Enable Cloudflare (free tier)
- Set up DDoS protection
- Configure API rate limits in Supabase

## Monitoring & Maintenance

### Key Metrics to Track

1. **User Engagement**
   - Daily active users
   - Meal confirmation rate
   - EcoPoints distribution

2. **Performance**
   - Page load time (target: <2s)
   - Time to Interactive (target: <3s)
   - API response time (target: <500ms)

3. **Database**
   - Query performance
   - Storage usage
   - Connection pool utilization

### Regular Maintenance Tasks

**Daily:**
- Check error logs
- Monitor confirmation counts
- Review user feedback

**Weekly:**
- Database backup verification
- Performance metrics review
- Security updates check

**Monthly:**
- Dependency updates
- Database optimization
- User analytics review

## Scaling Considerations

### Current Capacity

With default Supabase Free tier:
- 500MB database
- 2GB bandwidth/month
- 50,000 monthly active users
- 50GB file storage

### When to Scale

Upgrade to Supabase Pro when:
- 400+ daily active users
- 10GB+ database size
- Need 99.9% uptime SLA
- Require point-in-time recovery

### Optimization Tips

1. **Database Indexes**: Already created for frequent queries
2. **Connection Pooling**: Enabled by default in Supabase
3. **CDN**: Use Cloudflare for static assets
4. **Image Optimization**: Implement on-demand with Supabase Storage transforms

## Troubleshooting

### Common Issues

**Issue: Slow initial load**
- Check bundle size: `npm run build -- --stats`
- Implement lazy loading for heavy components
- Use React.lazy() for route components

**Issue: Authentication errors**
- Verify environment variables
- Check Supabase URL configuration
- Ensure RLS policies are correct

**Issue: Real-time not working**
- Check WebSocket connections
- Verify Supabase project status
- Test with smaller channel subscriptions

### Support Resources

- Supabase Docs: https://supabase.com/docs
- React Query Docs: https://tanstack.com/query/latest/docs
- GitHub Issues: [Your repo URL]

## Security Best Practices

1. Never commit `.env` files
2. Rotate API keys quarterly
3. Enable 2FA for admin accounts
4. Regular security audits
5. Keep dependencies updated
6. Monitor for suspicious activity
7. Use HTTPS only (enforced by Supabase)

## Success Criteria

Your deployment is successful when:
- All pages load in <2 seconds
- Authentication works smoothly
- Real-time updates appear instantly
- No console errors in production
- Mobile responsive on all devices
- Offline mode works (service worker active)
- Database queries execute in <500ms
- 99%+ uptime over 30 days
