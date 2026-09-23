import 'dotenv/config';
import express from 'express';
import dbConnection from './config/dbConnection.js';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import { protect } from './middleware/auth.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';



const app = express();
const allowedOrigins = [process.env.CORS_ORIGIN, process.env.CLIENT_URL]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin is not allowed by CORS"));
    },
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

// for test
app.get("/api/private-test", protect, (req, res) =>{
    res.json({
        success: true,
        message: `Hello ${req.user.name}`
    })
})


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes)

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