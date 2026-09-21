import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import dbConnection from './config/dbConnection.js';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/error.middleware.js';



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.send("Hello Guys How Are things now")
})

// API Routes

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: "ok",
        message: "Server is healthy",
    })
})


// Routes Will Be Added Here...

// Error Handlers will be used Here...

app.use(notFound)
app.use(errorHandler)



// To Start the express server

const PORT = process.env.PORT || 5000;

await dbConnection();  // to connect db first then start the server

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})