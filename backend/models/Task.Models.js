import mongoose from "mongoose";


// Designing the Schema for Task Model

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is Required"],
            trim: true,
            maxLength: 100,
        },

        description: {
            type: String,
            trim: true,
            maxLength: 1000,
            default: "",
        },

        status: {
            type: String,
            enum: ["Todo", "In-Progress", "Completed"],
            default: "Todo",
        },

        dueDate: {
            type: Date,
        },

        completedAt: {
            type: Date,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Owner is Required"],
            index: true,
        }
    },
    {timestamps: true}
)

export const Task = mongoose.model("Task", taskSchema);

