import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './lib/db.js';
import router from './routes/userRoutes.js';
import messagerouter from './routes/messageRoute.js';
//Create express app using http server
const app = express();
const server = http.createServer(app);
//initialize socket.io server
export const io=new Server(server,{
    cors:{
        origin:"*",
    }
})
//store online users
export const userSocketMap={};
//socket connection
io.on("connection",(socket)=>{
const userID=socket.handshake.query.userID;
console.log("User connected:",userID);
if(userID){
    userSocketMap[userID]=socket.id;
}
//emit online users to all connected users
io.emit("getOnlineusers",Object.keys(userSocketMap));
//handle disconnection
socket.on("disconnect",()=>{
    console.log("User disconnected:",userID);
    if(userID && userSocketMap[userID]){
        delete userSocketMap[userID];
    }
    //emit online users to all connected users
    io.emit("getOnlineusers",Object.keys(userSocketMap));
})
});
//Middlewares
app.use(express.json({limit: '4mb'}));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-url.netlify.app', 'https://your-frontend-url.vercel.app']
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
//Routes
app.use('/api/status', (req, res) => {
    res.send({status: 'Server is running'});
});
app.use('/api/auth',router)
app.use('/api/messages',messagerouter)
//connect to MongoDB
 await connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
