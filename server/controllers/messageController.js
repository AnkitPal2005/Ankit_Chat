import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap } from "../server.js";
import User from "../models/User.js";
//get all users
export const getUserForSidebar=async(req,res)=>{
    try{
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password");
        //message not seen
        const unseenMessages={};
        const promises=filteredUsers.map(async(user)=>{
            const messages=await Message.find({senderId:user._id,receiverId:userId,seen:false})
              if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
              }
        })
      await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenMessages});
    }
    catch(err){
        console.log("Error in getUserForSidebar",err);
        res.status(500).send({error:"Server error"});
    }
}
//get all messages between two users
export const getMessages=async(req,res)=>{
    try{
        const{id:selectedUserId}=req.params;
        const myId=req.user._id;
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myId}
            ]
            })
        await Message.updateMany({senderId:selectedUserId,receiverId:myId,seen:false},{seen:true});
        res.json({success:true,messages});
        
    }
    catch(err){
        console.log("Error in getMessages",err);
        res.status(500).send({error:"Server error"});
    }
}
//mark messages seen
export const markMessagesSeen=async(req,res)=>{
    try{
        const{id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true,message:"Messages marked as seen"});
    }
    catch(err){
        console.log("Error in markMessagesSeen",err);
        res.status(500).send({error:"Server error"});
    }
}
//send message to selected user
export const sendMessage=async(req,res)=>{
    try{
        const{text,image}=req.body;
        const receiverId=req.params.id;
        const senderId=req.user._id;
      let imageURL;
      if(image){
        const uploadResponse=await cloudinary.uploader.upload(image)
        imageURL=uploadResponse.secure_url;
      }
      const newMessage=await Message.create({
        senderId,
        receiverId,
        text,
        image:imageURL,
      });
        //emit the message to receiver socket
        const receiverSocketId=userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        
        res.json({success:true,newMessage});
        



    }
    catch(err){
        console.log("Error in sendMessage",err);
        res.status(500).send({error:"Server error"});
    }
}