# 🚀 Quick Deployment Guide for CarCustomizer

This guide will help you deploy your CarCustomizer application to production.

## ✅ Pre-Deployment Checklist

1. **Update Environment Variables**
   - Replace all test Stripe keys with production keys
   - Generate a strong JWT secret
   - Set up MongoDB Atlas (cloud database)
   - Update API URLs to point to production endpoints

2. **Security Updates**
   - Never commit `.env` files
   - Use environment variables for sensitive data
   - Enable HTTPS in production
   - Update CORS settings in backend

3. **Database Migration**
   - Export data from local MongoDB if needed
   - Import to MongoDB Atlas
   - Update connection strings

## 📦 Step-by-Step Deployment

### Method 1: Deploy to Render (Recommended)

#### Step 1: Prepare MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Whitelist all IPs (0.0.0.0/0) for public access

#### Step 2: Get Stripe Production Keys
1. Go to https://dashboard.stripe.com
2. Switch to "Production" mode (top right)
3. Get API keys from Developers → API keys
4. Save both secret and publishable keys

#### Step 3: Push to GitHub
```bash
cd /Applications/Arpit/Web-Dev/CarCustomizer

# Initialize git
git init
git add .
git commit -m "Initial commit: CarCustomizer"

# Create main branch
git branch -M main

# Add your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/CarCustomizer.git

# Push to GitHub
git push -u origin main
```

#### Step 4: Deploy Backend on Render
1. Go to https://render.com
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   ```
   Name: car-customizer-backend
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```
6. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV = production
   PORT = 5001
   MONGODB_URI = [your mongodb atlas connection string]
   JWT_SECRET = [generate a random secure string]
   JWT_EXPIRE = 7d
   STRIPE_SECRET_KEY = [your stripe production secret key]
   STRIPE_PUBLISHABLE_KEY = [your stripe production publishable key]
   CLIENT_URL = [will add after frontend deployment]
   ```
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy the deployed URL (e.g., `https://car-customizer-backend.onrender.com`)

#### Step 5: Deploy Frontend on Render
1. In Render dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   ```
   Name: car-customizer-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
4. Add Environment Variables:
   ```
   VITE_API_URL = [backend URL from step 4]/api
   VITE_STRIPE_PUBLISHABLE_KEY = [your stripe production publishable key]
   ```
5. Click "Create Static Site"
6. Wait for deployment (3-5 minutes)
7. Copy the deployed URL (e.g., `https://car-customizer-frontend.onrender.com`)

#### Step 6: Update Backend CORS
1. Go back to backend service in Render
2. Settings → Environment → Add variable:
   ```
   CLIENT_URL = [frontend URL from step 5]
   ```
3. Save and redeploy

### Method 2: Deploy to Railway

1. Go to https://railway.app
2. Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your CarCustomizer repository
5. Railway will auto-detect services
6. Add environment variables for each service
7. Deploy!

### Method 3: Separate Deployments

#### Frontend on Vercel
```bash
cd frontend
npm install -g vercel
vercel login
vercel

# Follow prompts
# Add environment variables in Vercel dashboard
```

#### Backend on Railway or Heroku
```bash
# Railway
npm install -g railway
railway login
railway init
railway up

# OR Heroku
npm install -g heroku
heroku login
heroku create car-customizer-api
git push heroku main
```

## 🔧 Post-Deployment Steps

### 1. Create Admin User
After deployment, you need to create an admin user:

Option A - Using MongoDB directly:
1. Go to MongoDB Atlas → Collections
2. Find `users` collection
3. Edit your user document
4. Change `role: "user"` to `role: "admin"`

Option B - Using backend script:
```bash
# SSH into server or use Railway/Render shell
cd backend
node makeAdmin.js your-email@example.com
```

### 2. Test Payment Flow
1. Use Stripe test cards first
2. Switch to production mode in Stripe Dashboard
3. Test with real card (small amount)
4. Verify webhooks are working

### 3. Setup Stripe Webhooks (Production)
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-backend-url.com/api/payment/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret
5. Add to backend environment variables: `STRIPE_WEBHOOK_SECRET`

### 4. Update DNS (Optional)
For custom domain:
1. Buy domain from Namecheap/GoDaddy
2. Add CNAME record pointing to your hosting provider
3. Configure SSL (usually automatic)

## 🐛 Troubleshooting

### Backend Issues
**Problem**: Database connection error
- Check MongoDB connection string
- Verify IP whitelist includes all IPs (0.0.0.0/0)
- Test connection locally with same string

**Problem**: CORS errors
- Ensure CLIENT_URL matches frontend URL exactly
- Check for trailing slashes
- Restart backend after env variable changes

**Problem**: Payment failures
- Verify Stripe keys are production keys
- Check webhook configuration
- Ensure HTTPS is enabled

### Frontend Issues
**Problem**: API calls failing
- Check VITE_API_URL is correct
- Verify backend is running
- Check browser console for errors

**Problem**: Build failures
- Clear cache: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Try building locally first

## 📊 Monitoring

### Free Monitoring Tools
1. **Uptime Robot** - Monitor uptime
2. **MongoDB Atlas** - Built-in database monitoring
3. **Stripe Dashboard** - Payment analytics
4. **Google Analytics** - User tracking (add to frontend)

### Logs
- **Render**: Dashboard → Logs tab
- **Railway**: Dashboard → View logs
- **Vercel**: Project → Activity

## 💰 Cost Estimates

### Free Tier (Good for testing)
- Render: Free (with limitations)
- MongoDB Atlas: Free (512MB)
- Stripe: Pay per transaction
- Total: $0/month + transaction fees

### Production Setup (~$20-40/month)
- Render/DigitalOcean: $7-15/month
- MongoDB Atlas: $0-9/month (M2/M5)
- Domain: $10-15/year
- Stripe: 2.9% + 30¢ per transaction

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit secrets
   - Use .env.example templates
   - Rotate keys periodically

2. **Database**
   - Use strong passwords
   - Enable authentication
   - Regular backups

3. **API**
   - Rate limiting (add express-rate-limit)
   - Input validation (already using express-validator)
   - HTTPS only

4. **Frontend**
   - Sanitize inputs
   - Use Helmet for headers
   - Content Security Policy

## 📈 Next Steps

1. Set up CI/CD with GitHub Actions
2. Add automated testing
3. Implement caching (Redis)
4. Add email notifications
5. Set up error tracking (Sentry)
6. Add analytics

## 🆘 Need Help?

- Check DEPLOYMENT.md for detailed info
- Review logs in hosting dashboard
- Test locally first
- Create GitHub issue for bugs

---

**Ready to deploy? Start with Method 1 (Render) - it's the easiest!** 🚀
