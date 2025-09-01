import { asyncHandler } from "../Utilities/asyncHandler.js";
import { ApiError } from "../Utilities/ApiError.js";
import { Tweet } from "../Models/tweet.model.js";
import { ApiResponse } from "../Utilities/ApiResponse.js";
import { User } from "../Models/user.model.js";
import mongoose from "mongoose";


const createTweet = asyncHandler( async(req,res) =>{
    const {content} = req.body
    if(!content){
        throw new ApiError(400,"content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })

    if(!tweet){
        throw new ApiError(400,"cannot create tweet")
    }

    return res.status(201)
    .json(new ApiResponse(201,tweet,"tweet created successfull"))
})

const getTweet = asyncHandler( async(req,res)=>{

    const usertweet = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"tweets",
                localField:"_id",
                foreignField:"owner",
                as: "tweets"
            }
        }
    ])

    console.log("[*] tweet: ",usertweet);
    if(!usertweet){
        throw new ApiError(400,"no such user exist")
    }

    return res.status(200)
    .json(new ApiResponse(200,usertweet,"tweet fetched successfully"))
})

const updateTweet = asyncHandler( async(req,res) =>{
    const {tweetid} = req.params
    const {content} = req.body
    if(!tweetid){
        throw new ApiError(400,"tweet id is required")
    }

    if(!content){
        throw new ApiError(400,"tweet content is required")
    }

    const tweet = await Tweet.findById(tweetid)

    if (!tweet){
        throw new ApiError(400,"no such tweet exist")
    }

    if(req.user._id.toString() !== tweet.owner.toString()){
        throw new ApiError(404,"unauthorized error")
    }

    tweet.content = content
    await tweet.save()

    return res.status(200)
    .json(new ApiResponse(200,tweet,"content updated successfull"))
})

const deleteTweet = asyncHandler( async(req,res) =>{
    const {tweetid} = req.params
    if(!tweetid){
        throw new ApiError(400,"tweet id is required")
    }

    const tweet = await Tweet.findById(tweetid)

    if (!tweet){
        throw new ApiError(400,"no such tweet exist")
    }

    if(req.user._id.toString() !== tweet.owner.toString()){
        throw new ApiError(404,"unauthorized error")
    }

    await tweet.deleteOne()

    return res.status(200)
    .json(new ApiResponse(200,{},"tweet is deleted"))
})

export {createTweet, getTweet, updateTweet, deleteTweet}