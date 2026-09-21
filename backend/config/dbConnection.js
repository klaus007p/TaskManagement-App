import mongoose from "mongoose";

const dbConnection = async () => {
    // To fetch Data from the Database

    try {
        const uri = process.env.MONGO_URI;
        
    // If URI is not found then throw an Error
        if (!uri) {
            throw new Error("Please provide a valid MONGODB_URI");
        }

        mongoose.set("strictQuery", true); // To filter out the extra query in MongoDB

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // fail fast instead of hanging ~30s
        });

        console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn; // Returns the connection

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

export default dbConnection;