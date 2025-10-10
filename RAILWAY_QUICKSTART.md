# 🚂 Railway Deployment - Quick Start

Your StudyFlow app is **100% ready** for Railway deployment!

## Step-by-Step Guide

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Ready for Railway deployment"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy to Railway

1. **Go to Railway:** https://railway.app
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository**

### 3. Add PostgreSQL Database

1. In your Railway project dashboard, click **"New"**
2. Select **"Database" → "Add PostgreSQL"**
3. Railway automatically sets `DATABASE_URL` ✅

### 4. Set Environment Variables

In your service settings, go to **"Variables"** tab and add:

```
NODE_ENV=production
SESSION_SECRET=<click "Generate" button>
```

That's it! Railway will automatically:
- ✅ Build your app using the config in `railway.json`
- ✅ Run database migrations (`npm run db:push`)
- ✅ Start your server (`npm start`)
- ✅ Assign a public URL

## What's Already Configured

✅ **railway.json** - Build and deploy settings
✅ **Database migrations** - Runs automatically during build
✅ **PORT configuration** - Uses Railway's PORT environment variable
✅ **Session storage** - PostgreSQL-backed sessions
✅ **Production build** - Optimized Vite + esbuild bundle

## Verify Deployment

After deployment:
1. Visit your Railway URL
2. Create an account
3. Test all features (habits, todos, exams, grades)

## Need Help?

📖 Full guide: See `RAILWAY_DEPLOYMENT.md`
🆘 Railway Docs: https://docs.railway.app
💬 Railway Discord: https://discord.gg/railway

---

**Your app is production-ready! 🚀**
