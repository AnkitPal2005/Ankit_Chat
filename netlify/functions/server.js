import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import serverless from 'serverless-http';

// Models
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 6, max: 64 },
    pic: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
    bio: { type: String }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    image: { type: String },
    seen: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utils
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET);
};

// Middleware
const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.headers['token'];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

const app = express();

// Middlewares
app.use(express.json({ limit: '4mb' }));
app.use(cors({
    origin: ['https://effervescent-starship-e7dc24.netlify.app', 'http://localhost:5173'],
    credentials: true
}));

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
    const { fullname, email, password, bio } = req.body;
    try {
        if (!fullname || !email || !password || !bio) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ fullname, email, password: hashedPassword, bio });
        const token = generateToken(newUser._id);
        return res.status(201).json({
            success: true,
            userData: newUser,
            token,
            message: "User created successfully",
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = generateToken(user._id);
        res.json({
            success: true,
            userData: user,
            token,
            message: "Login successful",
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/api/auth/check-auth', protectRoute, (req, res) => {
    res.json({ success: true, user: req.user });
});

app.put('/api/auth/update-profile', protectRoute, async (req, res) => {
    try {
        const { fullname, bio, pic } = req.body;
        const userId = req.user._id;
        let updatedUser;
        if (!pic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullname, bio },
                { new: true }
            ).select("-password");
        } else {
            const upload = await cloudinary.uploader.upload(pic);
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullname, bio, pic: upload.secure_url },
                { new: true }
            ).select("-password");
        }
        res.json({
            success: true,
            updatedUser,
            message: "Profile updated successfully",
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Message Routes
app.get('/api/messages/users', protectRoute, async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });
        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/api/messages/:id', protectRoute, async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        });
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId, seen: false }, { seen: true });
        res.json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/api/messages/send/:id', protectRoute, async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
        let imageURL;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageURL,
        });
        res.json({ success: true, newMessage });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.put('/api/messages/mark/:id', protectRoute, async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true, message: "Messages marked as seen" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/api/status', (req, res) => {
    res.json({ status: 'Server is running on Netlify Functions' });
});

// Database connection
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.log("Error in connecting to MongoDB", err);
    }
};

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
    await connectDB();
    return serverlessHandler(event, context);
};