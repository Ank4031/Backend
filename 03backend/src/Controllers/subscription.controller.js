import mongoose from "mongoose"
import { asyncHandler } from "../Utilities/asyncHandler.js"
import { ApiError } from "../Utilities/ApiError.js"
import { ApiResponse } from "../Utilities/ApiResponse.js"
import { User } from "../Models/user.model.js"
import { Subscription } from "../Models/subscription.model.js"

const getSubscribedChannel = asyncHandler( async(req,res) =>{
    const subscribedchannels = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            },
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subs"
            },
        },
        {
            $project:{
                subs: 1,
                _id: 0
            }
        }
    ])

    console.log("[*] subscribed: ",subscribedchannels);
    if(!subscribedchannels){
        throw new ApiError(400,"no subscribed details found")
    }

    return res.status(200)
    .json(new ApiResponse(200,subscribedchannels,"subscribed details fetched successfully"))
})

const getSubscribers = asyncHandler( async(req,res) =>{
    const subscribers = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $project:{
                subscribers: 1,
                _id: 0
            }
        }
    ])

    console.log(subscribers);
    if(!subscribers){
        throw new ApiError(400,"cannot get subscriber details")
    }

    return res.status(200)
    .json(new ApiResponse(200,subscribers,"subscribers fetched successfully"))
    
})

const toggleSubscription = asyncHandler( async(req,res) =>{
    const {channelid} = req.params

    if(!channelid){
        throw new ApiError(400,"channel id is required")
    }

    if(channelid.toString() === req.user._id.toString()){
        throw new ApiError(400,"cannot subscribe to same channel")
    }

    const subscribed = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelid
    })

    console.log(subscribed);
    let sub = null;
    if(!subscribed){
        sub = await Subscription.create({
            subscriber: req.user._id,
            channel: channelid
        })
    }else{
        sub = await Subscription.findOneAndDelete({
            subscriber: req.user._id,
            channel: channelid
        })
    }

    if(!sub){
        throw new ApiError(400,"cannot make any changes")
    }

    return res.status(200)
    .json(new ApiResponse(200,sub,"successfull request"))
    
})

export {getSubscribedChannel, getSubscribers, toggleSubscription}