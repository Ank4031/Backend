import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const dbConnect = async()=>{
    try {
        console.log("=========================================");
        const mong = await mongoose.connect(process.env.DB_URL+`/${process.env.DB_NAME}`)
        console.log("[*] DB connection started--------------------------->");
    } catch (error) {
        console.log(error.message || "db connect error.");
        throw error;
    }
}

export default dbConnect