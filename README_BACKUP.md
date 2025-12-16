# WhatsApp Clone - Real-time Chat Application

A full-stack real-time chat application built with React, Node.js, Socket.io, and MongoDB. Features include user authentication, real-time messaging, image sharing, online status, and message notifications.

## Features

- 🔐 **User Authentication** - Sign up and login with JWT tokens
- 💬 **Real-time Messaging** - Instant messaging with Socket.io
- 📷 **Image Sharing** - Upload and share images via Cloudinary
- 🟢 **Online Status** - See who's online in real-time
- 🔔 **Message Notifications** - Unseen message counters
- 👤 **Profile Management** - Update profile picture, name, and bio
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Socket.io Client
- Axios
- React Router DOM
- React Hot Toast

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image Storage)
- bcryptjs (Password Hashing)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account for image storage

### 1. Clone the repository
```bash
git clone <repository-url>
cd whatsapp-clone
```

### 2. Server Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secure_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Client Setup
```bash
cd ../client
npm install
```

Create a `.env` file in the client directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Run the Application

Start the server:
```bash
cd server
npm run server
```

Start the client (in a new terminal):
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
whatsapp-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context for state management
│   │   ├── assets/         # Images and icons
│   │   └── lib/            # Utility functions
│   └── public/
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── lib/                # Utility functions
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/check-auth` - Verify authentication
- `PUT /api/auth/update-profile` - Update user profile

### Messages
- `GET /api/messages/users` - Get all users for sidebar
- `GET /api/messages/:id` - Get messages with specific user
- `POST /api/messages/send/:id` - Send message to user
- `PUT /api/messages/mark/:id` - Mark message as seen

## Socket Events

- `connection` - User connects to socket
- `disconnect` - User disconnects from socket
- `getOnlineusers` - Broadcast online users list
- `newMessage` - Real-time message delivery

## Usage

1. **Sign Up**: Create a new account with email, password, name, and bio
2. **Login**: Sign in with your credentials
3. **Chat**: Select a user from the sidebar to start chatting
4. **Send Messages**: Type and send text messages or upload images
5. **Profile**: Update your profile picture, name, and bio
6. **Online Status**: See who's currently online with green indicators

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.