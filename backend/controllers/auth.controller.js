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


// To login an existing user 

export const loginUser = asyncHandler (async (req, res) => {

    // Read the frontend Dataa

    const {email , password} = req.body;

    if(!email || !password){
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email: email.toLowerCase()}).select("+password");  // To check if user exists

    if(!user){
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        throw new ApiError(401, "Invalid email or password");
    }

    const token = user.generateToken();

    res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            userName: user.userName
        },
    });
});



// To get user Details


export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            userName: req.user.userName,
        },
    });
});