import {asyncHandler} from "../Utilities/asyncHandler.js"
import { ApiError } from "../Utilities/ApiError.js";
import { User } from "../Models/user.model.js";
import {uploadOnCloudnary} from "../Utilities/cloudinary.js"
import { ApiResponse } from "../Utilities/ApiResponse.js";
import jwt from 'jsonwebtoken';

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

export { registerUser, loginUser, logoutUser, refreshAccessToken}