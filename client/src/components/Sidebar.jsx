import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
const Sidebar = () => {

  const { logout, onlineUsers, authUser } = useContext(AuthContext)
  const{getUsers,users,selectedUser,setSelectedUser,unseenMessages,setUnseenMessages}=useContext(ChatContext);
 const[input,setInput]=useState(false);
  const navigate = useNavigate();
  const filteredUsers=input?users.filter((user)=>user.fullname.toLowerCase().includes(input.toLowerCase())):users;
 useEffect(()=>{
getUsers();
console.log(users)
 },[onlineUsers])
  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className="pb-5">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <img src={authUser?.profilePic || assets.avatar_icon} alt="Profile" className="w-10 h-10 rounded-full border-2 border-violet-500" />
            <div>
              <p className="font-medium">{authUser?.fullname || 'User'}</p>
              <p className="text-xs text-gray-400">My Account</p>
            </div>
          </div>
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Logo"
              className="max-h-5 cursor-pointer"
            />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={()=>logout()} className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
            <img src={assets.search_icon} alt="Search" className="w-3" />
            <input onChange={(e)=>setInput(e.target.value)} type="text" placeholder="Search User...." className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1" />

        </div>
      </div>
    <div className="flex flex-col">
        {filteredUsers.map((user,index)=>(
            <div onClick={()=>{setSelectedUser(user)}} key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm${selectedUser?._id===user._id&&'bg-[#282142]/50'}`}>
                <img src={user?.pic||assets.avatar_icon} alt="" className="w-[35px] aspect-[1/1] rounded-full" />
                <div className="flex flex-col leading-5">
                    <p>{user.fullname}</p>
                    {
                        onlineUsers.includes(user._id)
                        ? <span className="text-green-400 text-x5">Online</span>
                        : <span className="text-neutral-400 text-x5">Offline</span>
                    }
                </div>
                {
                    unseenMessages[user._id]>0&&<p className="absolute top-4 right-4 text-x5 h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">{unseenMessages[user._id]}</p>
                }
            </div>
        ))}
    </div>

    </div>
  );
};

export default Sidebar;
