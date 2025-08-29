import { User } from "../Models/user.model.js";
import { ApiError } from "../Utilities/ApiError.js";
import { asyncHandler } from "../Utilities/asyncHandler.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config()

export const verifyuser = asyncHandler(async (req, res, next) => {
    try {
        // console.log("[*] reqcookies: ",req.cookies);
        
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
        // console.log("[*] token: ",token);
        
        if(!token){
            throw new ApiError(404,"unAuthorized req")
        }
        
        const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedtoken?._id).select("-password -refreshtoken")
    
        if (!user){
            throw new ApiError(401,"invalid accesstoken")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid accesstoken 1")
    }
})