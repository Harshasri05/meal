# MealMate - Quick Start Guide

## Initial Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Your `.env` file should already contain:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

These are automatically configured through Supabase MCP integration.

### 3. Database Setup

All database migrations have been applied:
- Core schema with 8 tables
- Row Level Security policies
- Helper functions and triggers
- Audit logging system
- Seed data for testing

### 4. Start Development Server

```bash
npm run dev
```

App will be available at `http://localhost:8080`

## Creating Test Accounts

### Option 1: Sign Up via UI
1. Go to `http://localhost:8080`
2. Click "Sign Up" (you'll need to add this button)
3. Enter email, password, full name
4. Choose role (student/admin)

### Option 2: Create via Supabase Dashboard
1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add User"
3. Enter email and password
4. User metadata:
   ```json
   {
     "full_name": "Test Admin",
     "role": "admin"
   }
   ```

### Option 3: Use SQL
```sql
-- Create admin user (replace email and password)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User","role":"admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);
```

## Quick Testing

### Test Login
1. Go to `http://localhost:8080`
2. Login with your test account
3. You'll be redirected to `/home` (student) or `/admin` (admin)

### Test Meal Confirmations
1. Navigate to Home page
2. See weekly meal schedule
3. Confirm meals with portion size
4. Watch EcoPoints increase in real-time

### Test Real-time Updates
1. Open two browser windows
2. Login as admin in one, student in another
3. Student confirms meal
4. Watch admin dashboard update in real-time

### Test Analytics
1. Login as admin
2. Go to Admin Dashboard
3. View meal stats, waste trends, top users
4. All data from seed migration

## Key Features to Test

### Authentication
- [x] Login/Logout
- [x] Role-based routing
- [x] Protected routes
- [x] Profile creation on signup

### Student Features
- [x] View weekly menu
- [x] Confirm meals
- [x] Select portion size
- [x] Earn EcoPoints
- [x] Submit feedback
- [x] View history

### Admin Features
- [x] View all confirmations
- [x] Log waste weight
- [x] View analytics
- [x] See real-time counts
- [x] Access feedback
- [x] View top users

### Real-time
- [x] Confirmation counts update live
- [x] Notifications appear instantly
- [x] No page refresh needed
- [x] Connection state managed

## Project Structure

```
mealmate-main/
├── src/
│   ├── components/       # UI components
│   │   └── ui/          # shadcn components
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.tsx         # Authentication
│   │   ├── useMeals.ts         # Meal operations
│   │   ├── useMealSchedules.ts # Schedule ops
│   │   ├── useConfirmations.ts # Confirmation ops
│   │   ├── useFeedback.ts      # Feedback ops
│   │   ├── useAnalytics.ts     # Analytics ops
│   │   └── useRealtime.ts      # Real-time subs
│   ├── integrations/
│   │   └── supabase/    # Supabase setup
│   │       ├── client.ts       # Client instance
│   │       └── types.ts        # Database types
│   ├── lib/             # Utilities
│   │   ├── queryClient.ts      # React Query config
│   │   ├── registerSW.ts       # Service Worker
│   │   └── utils.ts            # Helpers
│   ├── pages/           # Route pages
│   │   ├── Login.tsx           # Login page
│   │   ├── Home.tsx            # Student home
│   │   ├── Profile.tsx         # User profile
│   │   ├── Feedback.tsx        # Feedback form
│   │   └── AdminDashboard.tsx  # Admin panel
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/
│   ├── sw.js            # Service Worker
│   └── manifest.json    # PWA manifest
├── supabase/            # Database migrations
└── DEPLOYMENT.md        # Deployment guide
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run preview         # Preview production build

# Database
# All handled via Supabase MCP integration

# Deployment
vercel --prod           # Deploy to Vercel
netlify deploy --prod   # Deploy to Netlify
```

## Troubleshooting

### Issue: "User not authenticated"
**Solution**: Check if you're logged in. JWT token may have expired (refresh page).

### Issue: "Permission denied for table"
**Solution**: RLS policies active. Check user role matches required permissions.

### Issue: Real-time not working
**Solution**: Check WebSocket connection. Supabase project must be active.

### Issue: Build fails
**Solution**: Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Database connection error
**Solution**: Verify environment variables:
```bash
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_PUBLISHABLE_KEY
```

## Next Steps

1. **Customize Pages**: Update mock data with real hooks
2. **Add Validations**: Implement Zod schemas for forms
3. **Add Images**: Upload meal images to Supabase Storage
4. **Enable Email**: Configure email templates in Supabase
5. **Add Tests**: Set up Jest/Vitest for unit tests
6. **Deploy**: Follow DEPLOYMENT.md for production

## Support

- **Documentation**: Check `PRODUCTION_FEATURES.md` for detailed features
- **Deployment**: See `DEPLOYMENT.md` for production setup
- **Database**: All schemas documented in migration files
- **API**: Check hook files for available operations

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com)

You're all set! Start building amazing features with MealMate.
