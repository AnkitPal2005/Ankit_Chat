# Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
# Install root dependencies (optional - for running both client and server together)
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

**Server (.env in server folder):**
```env
MONGODB_URI="mongodb+srv://Ankit:Ankit123@cluster0.idfsnx3.mongodb.net"
PORT=5000
JWT_SECRET="your_secure_secret_key_here_12345"
CLOUDINARY_CLOUD_NAME="dq1hp8tme"
CLOUDINARY_API_KEY="688925427389457"
CLOUDINARY_API_SECRET="biSC0DanZ_Zpxyz0SRo-akZH5yE"
```

**Client (.env in client folder):**
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Run the Application

**Option 1: Run both together (from root directory)**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Server):
```bash
cd server
npm run server
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

### 4. Access the Application
- Open your browser and go to: `http://localhost:5173`
- Create an account or login
- Start chatting!

## 🔧 Troubleshooting

### Common Issues:

1. **Port already in use**
   - Change PORT in server/.env to a different port (e.g., 5001)
   - Update VITE_BACKEND_URL in client/.env accordingly

2. **MongoDB connection error**
   - Check your MongoDB URI in server/.env
   - Ensure your IP is whitelisted in MongoDB Atlas

3. **Images not uploading**
   - Verify Cloudinary credentials in server/.env
   - Check if Cloudinary account is active

4. **Real-time messages not working**
   - Ensure both client and server are running
   - Check browser console for Socket.io connection errors

### Development Notes:
- The server runs on port 5000 by default
- The client runs on port 5173 by default (Vite)
- MongoDB database name: "WhatSappDataBase"
- JWT tokens don't expire (for development convenience)

## 📱 Features to Test:
1. User registration and login
2. Real-time messaging
3. Image sharing
4. Online/offline status
5. Profile updates
6. Message notifications