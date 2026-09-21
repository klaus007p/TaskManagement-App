// Creating our own error class

class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}


export default ApiError;