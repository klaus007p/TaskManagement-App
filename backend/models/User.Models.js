import mongoose from "mongoose";

// Designing the Schema For User model

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: ["Name is Required",true],
        trim: true,
    },

    email: {
        type: String,
        required: ["Email is Required",true],
        unique: true,
        trim: true,
        lowercase: true,
    },

    userName: {
        type: String,
        required: ["Username is Required", true],
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        required: ["Password is Required",true],
        minlength: [8,"Password must be at least 8 characters long"],
        select: false,
        trim: true,
    },

    // Will Add password hashing later using bcrypt  #Todo: 1
    
})


export const User = mongoose.model("User", userSchema);