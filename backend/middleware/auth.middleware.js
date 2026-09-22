import jwt from 'jsonwebtoken';
import { User } from '../models/User.Models.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';


// Auth Protection Route

export const protect = asyncHandler (async (req, res, next) => {
    // Get Auth Token
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new ApiError(401, "Not Authorized, no token");
    }

    const token = authHeader.split(" ")[1];

    // To verify the token to get id

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if(!user){
        throw new ApiError(401, "Not Authorized, User no longer exist")
    }

    req.user = user;
    next();
    
});
