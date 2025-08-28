import {asyncHandler} from "../Utilities/asyncHandler.js"
import { ApiError } from "../Utilities/ApiError.js";
import { User } from "../Models/user.model.js";
import {uploadOnCloudnary} from "../Utilities/cloudinary.js"
import { ApiResponse } from "../Utilities/ApiResponse.js";

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

export { registerUser }