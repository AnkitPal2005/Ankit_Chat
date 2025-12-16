# 🚀 Deployment Guide - WhatsApp Clone

## Option 1: Vercel + MongoDB Atlas (Recommended)

### Backend Deployment (Vercel)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/whatsappclone`

2. **Deploy Backend to Vercel**
   ```bash
   cd server
   npm install -g vercel
   vercel login
   vercel
   ```

3. **Set Environment Variables in Vercel**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add CLOUDINARY_CLOUD_NAME
   vercel env add CLOUDINARY_API_KEY
   vercel env add CLOUDINARY_API_SECRET
   ```

### Frontend Deployment (Netlify)

1. **Update client/.env for production**
   ```env
   VITE_BACKEND_URL=https://your-vercel-backend-url.vercel.app
   ```

2. **Build and Deploy**
   ```bash
   cd client
   npm run build
   ```

3. **Deploy to Netlify**
   - Drag and drop `client/dist` folder to [Netlify](https://netlify.com)
   - Or connect GitHub repo for auto-deployment

## Option 2: Railway (Full-Stack)

1. **Connect GitHub Repository**
   - Push code to GitHub
   - Connect to [Railway](https://railway.app)

2. **Deploy Backend**
   - Create new project
   - Add MongoDB service
   - Set environment variables
   - Deploy from GitHub

3. **Deploy Frontend**
   - Create another service
   - Set build command: `cd client && npm run build`
   - Set start command: `cd client && npm run preview`

## Option 3: Render (Free Tier)

### Backend (Render Web Service)
1. Connect GitHub repo
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Add environment variables

### Frontend (Render Static Site)
1. Set build command: `cd client && npm run build`
2. Set publish directory: `client/dist`

## Environment Variables Needed:

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsappclone
PORT=5000
JWT_SECRET=your_secure_secret_key_here_12345
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (.env)
```env
VITE_BACKEND_URL=https://your-backend-url.com
```

## Quick Deploy Commands:

### For Vercel (Backend)
```bash
cd server
vercel --prod
```

### For Netlify (Frontend)
```bash
cd client
npm run build
netlify deploy --prod --dir=dist
```

## 🔧 Post-Deployment Checklist:

- [ ] MongoDB Atlas IP whitelist (0.0.0.0/0 for all IPs)
- [ ] CORS settings updated for production URLs
- [ ] Environment variables set correctly
- [ ] SSL certificates working
- [ ] Socket.io connection working
- [ ] Image upload working (Cloudinary)
- [ ] Real-time messaging working

## 🚨 Common Issues:

1. **CORS Error**: Update CORS origin in server.js
2. **Socket.io not connecting**: Check WebSocket support
3. **Images not uploading**: Verify Cloudinary credentials
4. **Database connection**: Check MongoDB Atlas IP whitelist

## 📱 Testing Production:

1. Create account
2. Login/logout
3. Send messages
4. Upload images
5. Check real-time features
6. Test on mobile devices