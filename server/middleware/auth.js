import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
    try {
        // Check for token in Authorization header or query parameter
        const token = req.headers.authorization?.split(' ')[1] || req.query.token || req.headers['x-access-token'] || req.headers['token'];
        
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from the token
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        // Add user to request object
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(401).json({ error: 'Authentication failed' });
    }
};
export const checkAuth=async(req,res)=>{
    res.json({success:true,user:req.user});
}