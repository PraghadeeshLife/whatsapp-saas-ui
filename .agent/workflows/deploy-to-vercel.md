---
description: How to deploy the Agentic SaaS frontend to Vercel
---

Follow these steps to deploy your Next.js application to Vercel:

### 1. Push to GitHub
Ensure your code is pushed to a GitHub, GitLab, or Bitbucket repository.
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **"Add New"** > **"Project"**.
3. Import your repository from the list.

### 3. Configure Environment Variables
During the import process, expand the **"Environment Variables"** section and add the following keys from your `.env.local`:

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `NEXT_PUBLIC_BACKEND_URL` | The URL of your deployed FastAPI backend |

> [!IMPORTANT]
> Ensure the `NEXT_PUBLIC_BACKEND_URL` points to your production backend (e.g., `https://api.yourdomain.com`).

### 4. Deploy
Click **"Deploy"**. Vercel will automatically build and deploy your application.

### 5. Post-Deployment
- Update your **CORS settings** in the FastAPI backend (`.env` or `config.py`) to allow requests from your new Vercel production URL.
- If you use custom domains, configure them in the Vercel project settings under **"Domains"**.
