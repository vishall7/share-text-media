import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URI}${DB_NAME}`);
        console.log(`database connected at host: ${connectionInstance.connection.host}`);
    } catch (err) {
        console.error("mongodb connection error:- ", err.message);
        process.exit(1)
    }
}

export { connectDB }