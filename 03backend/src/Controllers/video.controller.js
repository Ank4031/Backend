import mongoose from "mongoose";
import { asyncHandler } from "../Utilities/asyncHandler.js";
import { ApiError } from "../Utilities/ApiError.js";
import { Video } from "../Models/video.model.js";
import { uploadOnCloudnary } from "../Utilities/cloudinary.js";
import { ApiResponse } from "../Utilities/ApiResponse.js";


const publishAVideo = asyncHandler( async(req,res) =>{
    const {title,description} = req.body

    if(!title || !description){
        throw new ApiError(400,"title and description is needed")
    }

    console.log("[*] req.files data",req.files);
    
    const videofilepath = req.files?.video[0].path
    const thumbnailfilepath = req.files?.thumbnail[0].path

    if (!videofilepath || !thumbnailfilepath){
        throw new ApiError(400,"video or thumbnail required")
    }

    const thumbnail = await uploadOnCloudnary(thumbnailfilepath)
    const videofile = await uploadOnCloudnary(videofilepath)
    console.log("[*] videofile: ",videofile);
    

    if (!videofile || !thumbnail){
        throw new ApiError(400,"video or thumbnail not uploaded")
    }

    const user = req.user
    console.log("[*] user: ",user);
    
    if(!user){
        throw new ApiError(400,"not an authorized user")
    }

    const video = await Video.create({
        videofile: videofile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videofile.duration,
        owner: user._id
    })

    if(!video){
        throw new ApiError(500,"video cannot be uploaded")
    }

    return res.status(200)
    .json(new ApiResponse(200,video,"video uploaded successfull"))

})

const getVideo = asyncHandler( async(req,res) =>{
    const {videoid} = req.params
    console.log("[*] video id: ",videoid);
    
    if(!videoid){
        throw new ApiError(400,"videoid is required")
    }

    const video = await Video.findById(videoid)
    console.log("[*] video: ",video);
    
    if(!video){
        throw new ApiError(400,"no such video exist")
    }

    return res.status(200)
    .json(new ApiResponse(200,{url: video.videofile},"video url got successfully"))

})

const updateVideo = asyncHandler( async(req,res) =>{
    const {videoid} = req.params
    const {title,description} = req.body
    if(!videoid){
        throw new ApiError(400,"video id is required")
    }

    if(!title || !description){
        throw new ApiError(400,"title and description is required")
    }

    console.log(req.files);
    if (!req.files.video || !req.files.thumbnail){
        throw new ApiError(400,"video and thumbnail is not given")
    }

    const videodetails = await Video.findById(videoid)
    if(req.user._id.toString() !== videodetails.owner.toString()){
        throw new ApiError(400,"unauthorized user")
    }
    
    const videofilepath = req.files.video[0].path
    const thumbnailfilepath = req.files.thumbnail[0].path
    if (!videofilepath || !thumbnailfilepath){
        throw new ApiError(400,"video and thumbnail is required")
    }

    const videofile = await uploadOnCloudnary(videofilepath)
    const thumbnail = await uploadOnCloudnary(thumbnailfilepath)

    const video = await Video.findByIdAndUpdate(
        videoid,
        {
            $set:{
                videofile:videofile.url,
                thumbnail:thumbnail.url,
                title,
                description
            }
        },
        {new:true}
    )

    if (!video){
        throw new ApiError(400,"video cannot be updated")
    }

    return res.status(200)
    .json(new ApiResponse(200,video,"video updated successfully"))
})

const deleteVideo = asyncHandler( async(req,res) =>{
    const {videoid} = req.params
    if(!videoid){
        throw new ApiError(400,"video id is needed")
    }

    const video = await Video.findById(videoid)
    if(!video){
        throw new ApiError(400,"no such video exist")
    }

    if(req.user._id.toString() !== video.owner.toString()){
        throw new ApiError(404,"unauthorized user")
    }

    await video.deleteOne()

    return res.status(200)
    .json(new ApiResponse(200,{},"video deleted successfully"))
})

const togglePublishStatus = asyncHandler( async(req,res) =>{
    const {videoid} = req.params

    if(!videoid){
        throw new ApiError(400,"video id is needed")
    }

    const video = await Video.findById(videoid)

    if(!video){
        throw new ApiError(400,"no such video exist")
    }

    if(req.user._id.toString() !== video.owner.toString()){
        throw new ApiError(404,"unauthorized user")
    }

    video.ispublished = !video.ispublished
    await video.save()

    return res.status(200)
    .json(new ApiResponse(200,{ispublished: video.ispublished},"status changed"))

})

export {publishAVideo, getVideo, updateVideo, deleteVideo, togglePublishStatus}