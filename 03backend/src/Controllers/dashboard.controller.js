import { asyncHandler } from "../Utilities/asyncHandler.js";
import { ApiError } from "../Utilities/ApiError.js";
import { ApiResponse } from "../Utilities/ApiResponse.js";
import { User } from "../Models/user.model.js";
import mongoose from "mongoose";


const getChannelVideos = asyncHandler( async(req,res) =>{
    const allvideos = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
                pipeline: [
                    {
                        $project:{
                            _id:1,
                            videofile:1,
                            thumbnail:1,
                            title:1,
                            description:1
                        }
                    }
                ]
            }
        },
        {
            $project:{
                videos:1,
                _id:0
            }
        }
    ])

    if(!allvideos){
        throw new ApiError(400,"no videos found")
    }

    return res.status(200)
    .json(new ApiResponse(200,{videos:allvideos[0].videos},"videos fetched successfully"))
})

const getChannelStats = asyncHandler(async(req,res) =>{
    const stats = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"_id",
                foreignField:"owner",
                as: "videos",
            }
        },
        {
            $lookup:{
                from:"likes",
                let: {videoIds:"$videos._id"},
                pipeline:[
                    {
                        $match:{
                            $expr:{
                                $in:["$video","$$videoIds"]
                            }
                        }
                    }
                ],
                as: "likes",
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as: "channels",
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"videos._id",
                foreignField:"video",
                as: "comments",
            }
        },
        {
            $project:{
                totallikes:{$size:"$likes"},
                totalsub:{$size:"$channels"},
                totalviews:{$sum:"$videos.views"},
                totalvideos:{$size:"$videos"},
                totalcomments:{$size:"$comments"},
            }
        }
        
    ])

    if(!stats){
        throw new ApiError(400,"stats cannot be fetched")
    }

    return res.status(200)
    .json(new ApiResponse(200,stats,"stats are fetched successfully"))
}) 

export {getChannelVideos, getChannelStats}