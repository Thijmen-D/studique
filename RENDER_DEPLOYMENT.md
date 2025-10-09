# Deploying Studique to Render

## Prerequisites
1. A Render account (sign up at https://render.com)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Push your code to a Git repository** if you haven't already

2. **Create a new Blueprint instance on Render:**
   - Go to https://dashboard.render.com/blueprints
   - Click "New Blueprint Instance"
   - Connect your Git repository
   - Render will automatically detect the `render.yaml` file

3. **The configuration will automatically:**
   - Create a PostgreSQL database named `studique-db`
   - Set up the web service with the correct build and start commands
   - Run database migrations during build
   - Generate a secure SESSION_SECRET

4. **Click "Apply" to deploy**

### Option 2: Manual Setup

If you prefer to set up manually:

#### 1. Create a PostgreSQL Database
- Go to https://dashboard.render.com
- Click "New +" → "PostgreSQL"
- Name it `studique-db`
- Choose your plan (Free tier available)
- Click "Create Database"
- Copy the "Internal Database URL" (or "External Database URL" if using external connection)

#### 2. Create a Web Service
- Click "New +" → "Web Service"
- Connect your repository
- Configure the service:
  - **Name:** studique
  - **Environment:** Node
  - **Build Command:** `npm install && npm run build && npm run db:push`
  - **Start Command:** `npm start`
  - **Plan:** Choose your plan (Free tier available)

#### 3. Add Environment Variables
In the "Environment" section, add:
- `NODE_ENV` = `production`
- `DATABASE_URL` = (paste the database URL from step 1)
- `SESSION_SECRET` = (generate a random string, e.g., using `openssl rand -hex 32`)

#### 4. Deploy
- Click "Create Web Service"
- Render will build and deploy your application

## Important Notes

### Database Connection
The app is configured to use standard PostgreSQL (not Neon serverless) which works perfectly with Render's PostgreSQL offering.

### Port Configuration
The app automatically uses Render's assigned PORT environment variable, so no configuration needed.

### Session Storage
Sessions are stored in PostgreSQL using the `sessions` table, which will be automatically created during the migration.

### Build Process
The build command includes:
1. `npm install` - Install dependencies
2. `npm run build` - Build frontend and backend
3. `npm run db:push` - Push database schema

### Health Checks
Render will automatically perform health checks on your service. The app responds on the root path `/`.

## Troubleshooting

### Database Connection Errors
- Ensure DATABASE_URL is correctly set in environment variables
- Check that the database is in the same region for faster connection
- Verify the database is running and accessible

### Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json (not just devDependencies for production deps)
- Verify Node version compatibility

### Application Errors
- Check application logs in Render dashboard
- Ensure all required environment variables are set
- Verify database migrations ran successfully

## Post-Deployment

After successful deployment:
1. Visit your app URL (provided by Render)
2. Create a new account to test authentication
3. All features should work including:
   - User registration and login
   - Habit tracking
   - Todo management
   - Exam planning
   - Grade monitoring
   - Theme customization

## Scaling

To scale your application:
- Upgrade your Render plan for more resources
- Consider upgrading the database plan for better performance
- Enable auto-scaling in Render settings if needed
