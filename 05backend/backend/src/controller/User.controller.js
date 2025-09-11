import { AsyncHandler } from "../Utilities/AsyncHandler.js";
import { ApiError } from "../Utilities/ApiError.js";
import { ApiResponce } from "../Utilities/ApiResponce.js";
import { User } from "../models/User.model.js";

const RegisterUser = AsyncHandler(async (req,res)=>{
    console.log(req.body);
    
    const {name,username,email,password} = req.body
    if([name,username,email,password].some((i)=>(i?.trim()===""))){
        throw new ApiError(400,"all feilds are required")
    }

    
    const userexist = await User.findOne({ $or: [{username}, {email}] })
    if(userexist){
        throw new ApiError(400,"user already exist")
    }

    const user = await User.create({
        name,
        username,
        email,
        password
    })

    const createduser = await User.findById(user._id).select("-password -refreshtoken")

    if(!createduser){
        throw new ApiError(400,"server error")
    }

    return res.status(200)
    .json(new ApiResponce(200,createduser,"new user created"))
})

const LoginUser = AsyncHandler(async(req,res)=>{
    const  {username, email, password} = req.body;

    if(!(username || email)){
        throw new ApiError(400,"username or email required")
    }

    if(!password){
        throw new ApiError(400,"password is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    console.log("[*] usre:",user);

    if(!user){
        throw new ApiError(400,"no such user exist")
    }

    const check = await user.checkPassword(password);
    
    if(!check){
        throw new ApiError(400,"password is incorrect")
    }

    const accesstoken = await user.genAccessToken();
    const refreshtoken = await user.genRefreshToken();

    if(!accesstoken || !refreshtoken){
        throw new ApiError(400,"cannont genrate tokens")
    }

    user.refreshtoken = refreshtoken;
    user.save({ validateBeforeSave: false });

    const loginuser = await User.findById(user._id)

    if(!loginuser){
        throw new ApiError(500,"cannont get login user details")
    }

    const options={
        httpOnly: true,
        secure: false,
    }

    return res.status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(new ApiResponce(200,{user:loginuser, refreshtoken,accesstoken},"login successfull"))

})

const CheckLogin = AsyncHandler(async(req,res)=>{
    const user = req.user
    // console.log("--------------------------------------------------------->");
    // console.log("[*]user: ",user);
    if(!user){
        throw new ApiError(400,"user not logged in")
    }

    return res.status(200)
    .json(new ApiResponce(200,user,"user is logged in"))
})

const UserLogout = AsyncHandler(async(req,res)=>{
    const loddedinuser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshtoken: undefined
            }
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accesstoken",options)
    .cookie("refreshtoken",options)
    .json(new ApiResponce(200,{},"user logged out"))

})

export {RegisterUser, LoginUser, CheckLogin, UserLogout}