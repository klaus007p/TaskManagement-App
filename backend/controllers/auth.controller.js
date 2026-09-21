import { User } from '../models/User.Models.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';


// To Register the user

export const registerUser = asyncHandler (async (req, res) => {
    
    // Read the data from frontend

    const { name, email, userName, password} = req.body;

    if(!name || !email || !userName || !password){   // incase of empty data 
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.create({ name, email, userName, password });  // to register user

    res.status(201).json({
        success: true,
        message: "User Registered successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            userName: user.userName,
            
        },
    });
});

