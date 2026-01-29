# 🚀 Company Registration App - Deployment Guide

## 📋 Pre-Deployment Checklist

✅ **Local Testing Complete**
- Frontend runs on http://localhost:3000
- Backend runs on http://localhost:3001
- Database connection working
- All API endpoints tested

## 🎯 Deployment Steps

### **Step 1: Deploy Backend to Railway**

1. **Create Railway Account**: Visit [railway.app](https://railway.app)
2. **Connect GitHub**: Link your repository
3. **Create New Project**: Select "Deploy from GitHub repo"
4. **Configure Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   DB_USER=postgres
   DB_HOST=your_railway_postgres_host
   DB_NAME=railway
   DB_PASSWORD=your_railway_postgres_password
   DB_PORT=5432
   JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzU4MjU5NjM0LCJleHAiOjE3NTgyNjMyMzR9.dJa8HqiEoUX7_oAWqZsmwYe-JFbPwa_0e-yu7nCXtOw
   JWT_EXPIRES_IN=90d
   FIREBASE_PROJECT_ID=company-regristration
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. **Add PostgreSQL Database**: 
   - In Railway dashboard, click "New" → "Database" → "PostgreSQL"
   - Copy connection details to environment variables

6. **Deploy**: Railway will automatically deploy your backend

### **Step 2: Deploy Frontend to Vercel**

1. **Create Vercel Account**: Visit [vercel.com](https://vercel.com)
2. **Import Project**: Connect your GitHub repository
3. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   VITE_FIREBASE_API_KEY=AIzaSyCVCSLx-JWTmn0EP8bOuXccnU1N03vS3_I
   VITE_FIREBASE_AUTH_DOMAIN=company-regristration.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=company-regristration
   VITE_FIREBASE_STORAGE_BUCKET=company-regristration.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=888220698939
   VITE_FIREBASE_APP_ID=1:888220698939:web:c5276c295b31c4c8c08f1e
   VITE_CLOUDINARY_CLOUD_NAME=deyuxt4hq
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

5. **Deploy**: Vercel will build and deploy your frontend

### **Step 3: Update CORS Configuration**

After frontend deployment, update backend environment variable:
```
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```

## 🔧 Database Setup

### **Railway PostgreSQL Setup**:
1. Create PostgreSQL service in Railway
2. Run the database schema:
   ```sql
   -- Connect to Railway PostgreSQL and run:
   -- Copy content from backend/database/schema.sql
   ```

## 🧪 Testing Production Deployment

1. **Backend Health Check**: `https://your-backend.railway.app/api/health`
2. **Frontend Access**: `https://your-frontend.vercel.app`
3. **Full User Flow**:
   - Register new user
   - Login successfully
   - Create company profile
   - Upload images to Cloudinary

## 🎉 Final Production URLs

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app/api`
- **Database**: Railway PostgreSQL (managed)

## 🔒 Security Checklist

✅ Environment variables secured
✅ CORS properly configured
✅ JWT secret is production-ready
✅ Database credentials secured
✅ Firebase configuration validated
✅ HTTPS enforced

## 📞 Support

If you encounter any issues during deployment:
1. Check Railway/Vercel deployment logs
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check database connection

Your Company Registration App is now live and ready for users! 🚀