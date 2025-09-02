import { Like } from "../Models/like.model.js";
import { User } from "../Models/user.model.js";
import { ApiError } from "../Utilities/ApiError.js";
import { ApiResponse } from "../Utilities/ApiResponse.js";
import { asyncHandler } from "../Utilities/asyncHandler.js";


const toggleVideoLike = asyncHandler( async(req,res) =>{
    const {videoid} = req.params
    if(!videoid){
        throw new ApiError(400,"video id required")
    }

    let action = "unliked"
    const videolike = await Like.findOneAndDelete(
        {video:videoid, likedby:req.user._id}
    )
    
    if(!videolike){
        const like = await Like.create({
            video: videoid,
            likedby: req.user._id
        })

        if(!like){
            throw new ApiError(400,"cannot like the video")
        }
        action = "liked"
    }

    return res.status(200)
    .json(new ApiResponse(200,{action},"toggled the video like"))
    
})

const toggleCommentLike = asyncHandler( async(req,res) =>{
    const {commentid} = req.params
    if(!commentid){
        throw new ApiError(400,"comment id required")
    }
    let action = "unliked"
    const commentlike = await Like.findOneAndDelete(
        {comment:commentid, likedby:req.user._id}
    )
    
    if(!commentlike){
        const like = await Like.create({
            comment: commentid,
            likedby: req.user._id
        })

        if(!like){
            throw new ApiError(400,"cannot like the comment")
        }
        action = "liked"
    }

    return res.status(200)
    .json(new ApiResponse(200,{action},"toggled the comment like"))
})

const toggleTweetLike = asyncHandler( async(req,res) =>{
    const {tweetid} = req.params
    if(!tweetid){
        throw new ApiError(400,"tweet id required")
    }

    let action = "unliked"
    const tweetlike = await Like.findOneAndDelete(
        {tweet:tweetid, likedby:req.user._id}
    )
    
    if(!tweetlike){
        const like = await Like.create({
            tweet: tweetid,
            likedby: req.user._id
        })

        if(!like){
            throw new ApiError(400,"cannot like the tweet")
        }
        action = "liked"
    }

    return res.status(200)
    .json(new ApiResponse(200,{action},"toggled the tweet like"))

})

const getLikedVideos = asyncHandler( async(req,res) =>{
    const videos = await Like.find({
        likedby: req.user._id,
        video: {$exists: true} 
    })

    if(!videos){
        throw new ApiError(400,"no videos found")
    }

    return res.status(200)
    .json(new ApiResponse(200,videos,"likes videos fetched successfully"))
    
})

export {toggleCommentLike, toggleVideoLike, toggleTweetLike, getLikedVideos}