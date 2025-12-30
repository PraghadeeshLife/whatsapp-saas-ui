# Backend Integration Setup Instructions

## Prerequisites

Before testing the integration, you need to configure your Supabase credentials.

## Step 1: Get Supabase Credentials

You need the same Supabase credentials used in your backend:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 2: Update Environment Variables

Edit the `.env.local` file in the landing page directory:

```bash
cd /Users/praghadeeshtks/.gemini/antigravity/scratch/whatsapp-landing-ui
```

Update the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_API_URL=https://whatsapp-saas-appointment.onrender.com/api/v1
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
```

## Step 3: Restart the Development Server

After updating the environment variables, restart the dev server:

1. Stop the current server (Ctrl+C in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

## Step 4: Test the Integration

### Test Signup Flow
1. Navigate to http://localhost:3000
2. Click any "Get Started" button
3. Fill out the signup form with a new email and password (min 6 characters)
4. Submit the form
5. You should be redirected to `/dashboard`

### Test Tenant Setup
1. After signup, you'll see the tenant setup form
2. Fill in:
   - **Business Name**: Any name for your business
   - **WhatsApp Phone Number ID**: Get this from Meta Business Manager
   - **WhatsApp Access Token**: Get this from Meta Business Manager
3. Submit the form
4. Your tenant profile should be created and displayed

### Test Login Flow
1. Log out from the dashboard
2. Go to http://localhost:3000/login
3. Enter your signup credentials
4. You should be redirected to the dashboard with your tenant info

### Test Protected Routes
1. Log out
2. Try to access http://localhost:3000/dashboard directly
3. You should be redirected to `/login`

## API Endpoints Being Used

The integration connects to the following backend endpoints:

- `POST /api/v1/tenants/` - Create tenant profile
- `GET /api/v1/tenants/me` - Get current user's tenant
- `PATCH /api/v1/tenants/me` - Update tenant profile  
- `GET /api/v1/messages/` - Fetch message history

All requests include the Supabase JWT token in the `Authorization` header.

## Troubleshooting

### "Missing Supabase environment variables" Error
- Make sure you've updated `.env.local` with actual credentials
- Restart the dev server after making changes

### "Failed to create account" Error
- Check if the email is already registered
- Ensure password is at least 6 characters
- Check browser console for detailed error messages

### "Failed to create tenant" Error
- Make sure you're logged in
- Check if a tenant already exists for your account
- Verify the backend API is accessible at the URL

### API Connection Issues
- Verify the backend is running at `https://whatsapp-saas-appointment.onrender.com`
- Check if CORS is configured properly on the backend
- Look for errors in the browser DevTools Network tab

## Next Steps

Once testing is successful, you can:
1. Deploy the frontend to Vercel or another hosting platform
2. Update environment variables for production
3. Configure custom domain
4. Add more features like message search, analytics, etc.
