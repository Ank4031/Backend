import mongoose from "mongoose"
import dotenv from "dotenv"
import { withRetry } from "../resilience wrappers/RetryPattern.js";
dotenv.config()

const dbConnect = async()=>{
    try {
        console.log("=========================================");
        const mong = await withRetry(()=>mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`))
        console.log("[*] DB connection started--------------------------->");
    } catch (error) {
        console.log("db connect error.");
        throw error;
    }
}

export default dbConnect