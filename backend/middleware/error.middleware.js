import ApiError from "../utils/ApiError.js";



export const notFound = (req, res, next) => {
    next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};



export const errorHandler = (err, req, res, next) => {

    let statusCode = err.statusCode || 500;
    let message = err.message || "Server Error";

    // If mongoose schema validation failed / a field is invalid
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const message = [];
        for (const field in err.errors) {
            message.push(err.errors[field].message);
        }
        message = message.join(", ");  
    }

    // If Duplicate email or username exists

    if(err.code === 11000){
        statusCode = 409;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field} already Exists`;
    }

    res.status(statusCode).json({ success: false, message })
}


