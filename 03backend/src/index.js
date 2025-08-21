import mongoose from 'mongoose';
import {DB_NAME} from './constants.js';
import express from 'express';
import connectDB from './Db/db.js';
import dotenv from "dotenv";
import { app } from './app.js';
dotenv.config();

connectDB()
.then( ()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((e =>{
    console.error('Database connection error:', e);
    process.exit(1);
}))



/*
const app = express();
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`)
        app.on('error',(error)=>{
            console.log('error: ',error);
            throw error;
        });
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
})()
*/
