import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:64,
    },
    pic:{
        type:String,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    bio:{
        type:String 
    },
},{
    timestamps:true,
});
const User=mongoose.model("User",userSchema);
export default User;