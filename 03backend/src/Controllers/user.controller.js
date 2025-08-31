import {asyncHandler} from "../Utilities/asyncHandler.js"
import { ApiError } from "../Utilities/ApiError.js";
import { User } from "../Models/user.model.js";
import {uploadOnCloudnary} from "../Utilities/cloudinary.js"
import { ApiResponse } from "../Utilities/ApiResponse.js";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const generateAccessAndRefreshTokans = async (userid)=>{
    try {
        const user = await User.findById(userid)
        const accesstoken = await user.genrateAccessToken()
        const refreshtoken = await user.genrateRefreshToken()

        user.refreshtoken = refreshtoken
        await user.save({validateBeforeSave: false})

        return {accesstoken, refreshtoken}

    } catch (error) {
        throw new ApiError(500,"server error 2")
    }
}

const registerUser = asyncHandler( async (req,res) => {
    console.log("===========================================================");

    const {username, email, fullname, password} = req.body
    console.log("[*] email : ",email);
    if ([username, email, fullname, password].some((i)=>(i?.trim()===""))){
        throw new ApiError(400, "All feilds are required.")
    }

    const existeduser = await User.findOne({
        $or: [{username},{email}]
    })
    console.log("[*] existeduser: ",existeduser);
    
    if (existeduser){
        throw new ApiError(409,"User already exist.")
    }

    const avatarfilepath = req.files?.avatar[0]?.path;
    // const coverimgfilepath = req.files?.coverimg[0]?.path;
    // console.log("[*] avatarfilepath: ",avatarfilepath);
    // console.log("[*] coverimgfilepath: ",coverimgfilepath);

    let coverimgfilepath;
    if (req.files && Array.isArray(req.files.coverimg) && req.files.coverimg.length > 0){
        coverimgfilepath = req.files?.coverimg[0]?.path;
    }
    
    if (!avatarfilepath){
        throw new ApiError(400, "Avatar is required.")
    }

    const avatarres = await uploadOnCloudnary(avatarfilepath);
    const coverimgres = await uploadOnCloudnary(coverimgfilepath);

    // console.log("[*] avatarres: ",avatarres.url);
    // console.log("[*] coverimgres: ",coverimgres.url);

    if (!avatarres){
        throw new ApiError(400, "File was not uploaded")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        avatar: avatarres.url,
        coverimg: coverimgres?.url || "",
        password,
        email
    })

    const usercreated = await User.findById(user._id).select(
        "-Password -refreshtoken"
    )

    if (!usercreated){
        throw new ApiError(500, "server error.")
    }

    return res.status(201).json(
        new ApiResponse(200, usercreated, "user registered successfull.")
    )
} )

const loginUser = asyncHandler( async (req,res) => {
    //take user credentials from req.body
    //check for falidation
    //check if user exist
    //check is password is correct
    //generate access token
    //geneerated refresh token and send it to the database
    //send cookie
    //send res

    // console.log("[*] reqbody: ",req.body);
    
    const {email, username, password} = req.body

    if(!username && !email){
        throw new ApiError(400, "username or email required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if (!user){
        throw new ApiError(404, "user does not exist")
    }

    const passwordcheck = await user.isPasswordCorrect(password)

    if(!passwordcheck){
        throw new ApiError(401, "invalid password")
    }

    const {accesstoken,refreshtoken} = await generateAccessAndRefreshTokans(user._id);

    const logedinuser = await User.findById(user._id).select("-password -refreshtoken")

    const options = {
        httpOnly: true,
        secure: true,
    }
    // console.log("[*] accesstoken: ",accesstoken);
    
    return res.status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new ApiResponse(200,{user: logedinuser,accesstoken:accesstoken,refreshtoken:refreshtoken},"user logged in successfully")
    )

})

const logoutUser = asyncHandler( async (req,res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshtoken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .clearCookie("accesstoken",options)
    .clearCookie("refreshtoken",options)
    .json(
        new ApiResponse(200,{},"user logged out successfully")
    )
})

const refreshAccessToken = asyncHandler( async (req,res) =>{
    const incomingrefreshtoken = req.cookies?.refreshtoken || req.body?.refreshtoken

    if (!incomingrefreshtoken){
        throw new ApiError(401,"unauthorised request")
    }

    try {
        const decodedincommingrefreshtoken = jwt.verify(
            incomingrefreshtoken,
            process.env.REFRESH_TOKEN
        )
    
        const user = User.findById(decodedincommingrefreshtoken?._id)
    
        if (!user){
            throw new ApiError(401,"invalid token")
        }
    
        if (incomingrefreshtoken !== user?.refreshtoken){
             throw new ApiError(401,"refresh token expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accesstoken, newrefreshtoken} = await generateAccessAndRefreshTokans(user?._id)
        return res.status(200)
        .cookies("accesstoken",accesstoken,options)
        .cookies("refreshtoken",newrefreshtoken,options)
        .json(new ApiResponse(200,{accesstoken,refreshtoken:newrefreshtoken},"token refreshed"))
    } catch (error) {
        throw new ApiError(500,error?.message || "server error 4")
    }
})

const changeCurrentPassword = asyncHandler( async (req, res) =>{
    const {oldpassword, newpassword} = req.body
    const user = await User.findById(req.user?._id)

    const ispasswordcorrect = await user.isPasswordCorrect(oldpassword)
    if (!ispasswordcorrect){
        throw new ApiError(400,"invalid password")
    }

    user.password = newpassword
    await user.save({validateBeforeSave:false})

    return res.status(200)
    .json(new ApiResponse(200,{},"password changed successfully"))
})

const getCurrentUser = asyncHandler( async (req,res) =>{
    return res.status(200)
    .json(new ApiResponse(200,req.user,"user Data"))
})

const updateAccountDetails = asyncHandler( async (req,res) =>{
    const {fullname, email} = req.body

    if (!fullname || !email){
        throw new ApiError(400,"username or email cannot be empty")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"updation complete"))

})

const updateUserAvatar = asyncHandler( async (req,res) =>{
    const avatarlocalpath = req.file?.path

    if (!avatarlocalpath){
        throw new ApiError(400, "Avatar is required.")
    }

    const avatarres = uploadOnCloudnary(avatarlocalpath)

    if(!avatarres.url){
        throw new ApiError(400, "upload error on avatar.")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatarres.url
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"avatar is uploaded"))
})

const updateUserCoverimg = asyncHandler( async (req,res) =>{
    const coverimglocalpath = req.file?.path

    if (!coverimglocalpath){
        throw new ApiError(400, "Coverimg is required.")
    }

    const coverimgres = uploadOnCloudnary(coverimglocalpath)

    if(!coverimgres.url){
        throw new ApiError(400, "upload error on civerimg.")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverimg: coverimgres.url
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"coverimg is uploaded"))

})

const getChannelUserProfile = asyncHandler( async (req,res) =>{
    const {username} = req.params
    if(!username?.trim()){
        throw new ApiError(400,"missing username")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedto"
            }
        },
        {
            $addFields: {
                subscriberscount: {
                    $size: "$subscribers"
                },
                sunbscribedtocount: {
                    $size: "$subscribedto"
                },
                issubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id,"$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                email: 1,
                subscriberscount: 1,
                sunbscribedtocount: 1,
                issubscribed: 1,
                avatar: 1,
                coverimg: 1
            }
        }
    ])

    if (!channel?.length){
        throw new ApiError(400,"no such user exist")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,channel[0],"channel data send successfully")
    )

})

const getUserHistory = asyncHandler( async (req,res) =>{
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchhistory",
                foreignField: "_id",
                as: "watchhistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullname: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
    .json(
        new ApiResponse(200,user[0].watchhistory,"watch history data send successfully")
    )
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword
    , getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverimg, getChannelUserProfile, getUserHistory}