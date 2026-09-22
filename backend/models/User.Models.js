import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

    },
    {timestamps: true} // adds createdAt and updatedAt
)


// Will Add password hashing later using bcrypt  #Todo: 1

// Runs before save and hashes the password 

userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;

    this.password = await bcryptjs.hash(this.password, 10);
});

// Compares the pass... which is hashed

userSchema.methods.comparePassword = function(plainPass){
    return bcryptjs.compare(plainPass, this.password);
}

// To generate Token

userSchema.methods.generateToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};


export const User = mongoose.model("User", userSchema);