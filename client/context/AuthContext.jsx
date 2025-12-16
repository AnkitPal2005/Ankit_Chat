import { createContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from 'socket.io-client'
import { useState } from "react";
// Ensure the backend URL is properly set
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
console.log('Backend URL:', backendUrl);
axios.defaults.baseURL = backendUrl;
export const AuthContext = createContext();
export const AuthProvider=({children})=>{
    const[token,setToken]=useState(localStorage.getItem('token') || null);
    const[authUser,setAuthUser]=useState(null);
    const[onlineUsers,setOnlineUsers]=useState([]);
    const[socket,setSocket]=useState(null);

        const checkAuth=async()=>{
            console.log('checkAuth called');
            try {
                if(!token) {
                    console.log('No token found');
                    return;
                }
                
                console.log('Checking auth with token:', token.substring(0, 10) + '...');
                
                // Set the token in the Authorization header
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'token': token
                    }
                };
                
                console.log('Making request to /api/auth/check-auth');
                const response = await axios.get('/api/auth/check-auth', config)
                    .catch(err => {
                        console.error('API Error:', {
                            message: err.message,
                            response: err.response?.data,
                            status: err.response?.status
                        });
                        throw err;
                    });

                console.log('Auth check response:', response?.data);
                
                // Check if response exists and has data
                if (response && response.data) {
                    if (response.data.success && response.data.user) {
                        console.log('Authentication successful');
                        // Successful authentication
                        setAuthUser(response.data.user);
                        connectSocket(response.data.user);
                        return;
                    }
                    // If success is false but we have a message
                    if (response.data.message) {
                        console.log('Auth check message:', response.data.message);
                        throw new Error(response.data.message);
                    }
                }
                
                // If we get here, the response format is not as expected
                console.error('Invalid response format:', response);
                throw new Error('Invalid response from server');
                
            } catch (err) {
                console.error('Auth check error details:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    stack: err.stack
                });
                
                // Clear any existing tokens and reset state
                console.log('Clearing auth state due to error');
                localStorage.removeItem("token");
                delete axios.defaults.headers.common["token"];
                setToken(null);
                setAuthUser(null);
                
                // Only show error if it's not a 401 (Unauthorized) error
                const isUnauthorized = err.response?.status === 401;
                if (!isUnauthorized) {
                    const errorMessage = err.response?.data?.error || 
                                      err.message || 
                                      'Failed to verify authentication';
                    console.log('Showing error to user:', errorMessage);
                    toast.error(errorMessage);
                }
            }
        }
        //login function to handle user authentication
        const login=async(state,credentials)=>{
            try{
                console.log('Attempting login with:', { state, credentials: { ...credentials, password: '***' } });
                const response = await axios.post(`/api/auth/${state}`, credentials);
                console.log('Login response:', response.data);
                
                if (response.data && response.data.success) {
                    const userData = response.data.userData || response.data.user;
                    const token = response.data.token;
                    
                    if (!userData || !token) {
                        throw new Error('Incomplete response from server');
                    }
                    
                    // Update axios defaults with the new token
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    axios.defaults.headers.common['token'] = token;
                    
                    // Update state and storage
                    setAuthUser(userData);
                    setToken(token);
                    localStorage.setItem("token", token);
                    
                    // Connect socket after successful login
                    connectSocket(userData);
                    
                    toast.success(response.data.message || (state === 'login' ? 'Login successful' : 'Account created successfully'));
                } else {
                    const errorMessage = response.data?.message || 'Authentication failed';
                    throw new Error(errorMessage);
                }
            } catch(err) {
                console.error('Login error:', err);
                const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'An error occurred during login';
                toast.error(errorMessage);
            }
        }
        //logout function to handle user logout
        const logout=()=>{
            localStorage.removeItem("token");
            setToken(null);
            setAuthUser(null);
            setOnlineUsers([]);
            axios.defaults.headers.common["token"]=null;
            toast.success("Logged out successfully");
                socket.disconnect();
        }
        //update profile function to handle user profile update
        const updateProfile=async(body)=>{
            try{
                const{data}=await axios.put('/api/auth/update-profile',body);
                if(data.success){
                    setAuthUser(data.updatedUser);
                    toast.success("Profile updated successfully");
                }
                else{
                    toast.error(data.message);
                }
            }
            catch(err){
                toast.error(err.message);
            }
        }
        //connect socket
        const connectSocket=(userData)=>{
            if(!userData||socket?.connected) return;
            const newSocket=io(backendUrl,{
                query:{userID:userData._id}
            });
            newSocket.connect();
            setSocket(newSocket);
            newSocket.on('getOnlineusers',(usersIds)=>{
                setOnlineUsers(usersIds);
            });
        }
     useEffect(()=>{
        // Set the token in axios headers if it exists
        if(token){
            axios.defaults.headers.common["token"] = token;
            // Call checkAuth to verify the token
            checkAuth();
        } else {
            // If no token, make sure to clear any existing auth state
            setAuthUser(null);
            setOnlineUsers([]);
        }
     },[token]) // Add token as a dependency
    const value={
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}