# Deploying Studique to Railway

## Prerequisites
1. A Railway account (sign up at https://railway.app)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Create a New Project on Railway

1. **Login to Railway:**
   - Go to https://railway.app
   - Sign in with your GitHub account

2. **Create a New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your Studique repository
   - Railway will automatically detect it's a Node.js project

### 2. Add PostgreSQL Database

1. **Add Database Service:**
   - In your project dashboard, click "New"
   - Select "Database" → "Add PostgreSQL"
   - Railway will automatically create a PostgreSQL database

2. **Database Connection:**
   - The `DATABASE_URL` environment variable will be automatically set
   - No manual configuration needed!

### 3. Configure Environment Variables

Railway automatically provides `DATABASE_URL`, but you need to add:

1. **In your service settings, go to "Variables" tab**

2. **Add the following variables:**
   - `NODE_ENV` = `production`
   - `SESSION_SECRET` = (click "Generate" or use a random string)
   - `PORT` = Railway auto-assigns this, but it's handled automatically

### 4. Configure Build Settings (Optional)

Railway will auto-detect the settings from `railway.json`, but you can verify:

1. **Build Command:**
   ```bash
   npm install && npm run build && npm run db:push
   ```

2. **Start Command:**
   ```bash
   npm start
   ```

### 5. Deploy

1. **Automatic Deployment:**
   - Railway will automatically build and deploy
   - Watch the deployment logs in real-time

2. **Get Your URL:**
   - Once deployed, Railway provides a public URL
   - Find it under "Settings" → "Networking" → "Public Networking"
   - You can also add a custom domain

## Important Configuration

### Database Connection
- Railway automatically injects `DATABASE_URL` for the PostgreSQL service
- The app uses standard PostgreSQL (pg driver), fully compatible with Railway
- Connection pooling is handled automatically

### Port Configuration
- Railway automatically assigns a PORT via environment variable
- The app is configured to use `process.env.PORT` (defaults to 5000)
- No manual configuration needed

### Session Storage
- Sessions are stored in PostgreSQL using `connect-pg-simple`
- The `sessions` table is automatically created during migration

### Build Process
The build includes:
1. `npm install` - Install all dependencies
2. `npm run build` - Build frontend (Vite) and backend (esbuild)
3. `npm run db:push` - Push database schema with Drizzle

### Automatic Deployments
- Railway automatically redeploys on every git push to your main branch
- Configure this in Settings → "Deployment Triggers"

## Project Structure

Railway will deploy:
- **Web Service**: Your Express + Vite app
- **PostgreSQL Database**: Managed PostgreSQL instance
- **Environment Variables**: Securely stored secrets

## Troubleshooting

### Database Connection Issues
```bash
# Check these in Railway logs:
- DATABASE_URL is set correctly
- PostgreSQL service is running
- Migration (db:push) completed successfully
```

### Build Failures
- Check build logs in Railway dashboard
- Ensure `pg` is in dependencies (not devDependencies)
- Verify Node version compatibility (Railway uses Node 20 by default)

### Runtime Errors
- View application logs in Railway dashboard
- Check that all environment variables are set
- Verify database migrations ran during build

### Migration Issues
If `npm run db:push` fails during build:
- You can run migrations manually from Railway's terminal
- Or temporarily comment out `&& npm run db:push` from build command
- Then run it manually once: `railway run npm run db:push`

## Post-Deployment Checklist

After successful deployment:
1. ✅ Visit your Railway URL
2. ✅ Test user registration and login
3. ✅ Verify all features work:
   - Habit tracking
   - Todo management
   - Exam planning
   - Grade monitoring
   - Theme customization (light/dark mode)
   - Mood/energy tracking

## Useful Railway Commands

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# View logs
railway logs

# Run commands in Railway environment
railway run npm run db:push

# Open project in browser
railway open
```

## Scaling & Performance

### Free Tier Limits
- $5 free credit per month
- Shared CPU and memory
- Automatic sleeping after inactivity (can be disabled)

### Upgrading
- Hobby Plan: $5/month
- Pro Plan: $20/month
- More resources, no sleeping, priority support

### Database Optimization
- Railway PostgreSQL includes connection pooling
- Monitor usage in Railway dashboard
- Upgrade database plan if needed

## Custom Domain Setup

1. Go to your service in Railway
2. Click "Settings" → "Networking"
3. Under "Public Networking" → "Custom Domain"
4. Add your domain and configure DNS:
   - Add CNAME record pointing to Railway URL
   - Or use Railway's DNS if domain registered there

## Environment-Specific Configuration

### Development (Local)
```bash
NODE_ENV=development
DATABASE_URL=postgresql://localhost/studique
```

### Production (Railway)
```bash
NODE_ENV=production
DATABASE_URL=postgresql://... (auto-set by Railway)
SESSION_SECRET=... (set in Railway dashboard)
```

## Security Notes

- ✅ SESSION_SECRET is securely stored in Railway
- ✅ DATABASE_URL is automatically injected
- ✅ All secrets are encrypted at rest
- ✅ HTTPS is enabled by default
- ✅ PostgreSQL connections are encrypted

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: (your repository)

---

**Ready to deploy!** Simply push your code to GitHub and connect it to Railway. Everything is configured and ready to go! 🚀
