import mongoose from "mongoose";

// Designing the Schema For User model

const userSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },

        userName: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 characters long"],
            select: false,
        },

        // Will Add password hashing later using bcrypt  #Todo: 1

    },
    {timestamps: true} // adds createdAt and updatedAt
)


export const User = mongoose.model("User", userSchema);