import { AsyncHandler } from "../Utilities/AsyncHandler.js"
import { ApiError } from "../Utilities/ApiError.js"
import { User } from "../models/User.model.js"
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config()

export const UserVerify = AsyncHandler( async(req,res,next)=>{
    try{
        console.log("[*] token: ",req.cookies);
        console.log("-------------------------------------------------------");
        
        // console.log("[*] header: ",req.header);
        // console.log("-------------------------------------------------------");
        
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(404,"unAuthorized req")
        }
        
        const decodedtoken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        // console.log("[*] decodedtoken: ",decodedtoken);
        // console.log("-------------------------------------------------------");
        
        const user = await User.findById(decodedtoken?.id).select("-password -refreshtoken")
        
        if (!user){
            throw new ApiError(401,"invalid accesstoken")
        }
    
        req.user = user
        console.log("==================|||||||========================");
        
        next()
    }
    catch(error){
        throw new ApiError(401,error?.message || "invalid accesstoken 1")
    }
})

