import mongoose from "mongoose";


const dbConnection = async () => {
    // To fetch the Database
    try {
        const uri = process.env.MONGODB_URI;

        // If no uri is found 
        if(!uri){
            throw new Error(`Please provide a valid MONGO URI`)
        }

        mongoose.set('strictQuery', true) // To filter out the query present in schema

    } catch (error) {
        console.log("Database connection failed", error);  // If connection fails then shows error
        process.exit(1);
    }

    const conn = await mongoose.connect(uri)
    
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
    
    // Returns the connection

}