import { Task } from '../models/Task.Models.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';


// To Create a Task

export const createTask = asyncHandler(async (req, res) => {

    const {title, description, status, dueDate} = req.body;

    if(!title){
        throw new ApiError(400, "Title is required")
    }

    const task = await Task.create({
        title, 
        description,
        status,
        dueDate,
        owner: req.user._id,
    });

    res.status(200).json({
        success: true,
        task,
    });
});



// to list loggedin user tasks

export const getTask = asyncHandler(async (req, res) => {

    const tasks = await Task.find({owner: req.user._id}).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: tasks.length,
        tasks,
    });
});



// get single task if belongs to logged in user

export const getTaskById = asyncHandler(async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});

    if(!task){
        throw new ApiError(404, "Task not found");
    };

    res.status(200).json({
        success: true,
        task,
    });
});

// Update task if belongs to logged in user

export const updateTask = asyncHandler(async (req, res) => {
    const {title, description, status, dueDate} = req.body;

    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});

    if(!task){
        throw new ApiError(404, "Task not found");
    }

    if(title !== undefined) task.title = title;
    if(description !== undefined) task.description = description;
    if(dueDate !== undefined) task.dueDate = dueDate;

    if(status !== undefined){
        task.status = status,
        task.completedAt = status === 'Completed' ? new Date() : undefined;
    }

    await task.save(); // Runs schema validation 

    res.status(200).json({
        success: true,
        task,
    });    
});


// To Delete a task created by the user


export const deleteTask = asyncHandler(async (req, res) => {

    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if(!task){
        throw new ApiError(404, "Task not found");
    }

    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
    });
});