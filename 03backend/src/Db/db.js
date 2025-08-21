import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    console.log("==================================================================");
    let conn = await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`);
    console.log("MongoDB connected successfully");
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  }
}

export default connectDB;