import { asyncHandler } from "../Utilities/asyncHandler.js";
import { ApiError } from "../Utilities/ApiError.js";
import { ApiResponse } from "../Utilities/ApiResponse.js";
import { Playlist } from "../Models/playlist.model.js";
import { Video } from "../Models/video.model.js";
import { User } from "../Models/user.model.js";
import mongoose from "mongoose";


const createPlaylist = asyncHandler( async(req,res) =>{
    const {name, description} = req.body
    if(!name || !description){
        throw new ApiError(400,"name and description is required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    if (!playlist){
        throw new ApiError(400,"cannot create the playlist")
    }

    return res.status(200)
    .json(new ApiResponse(200,playlist,"playlist created sucessfully"))

})

const addVideo = asyncHandler( async(req,res) =>{
    const {playlistid, videoid} = req.params
    if(!playlistid || !videoid){
        throw new ApiError(400,"playlist id and video id is required")
    }

    const playlist = await Playlist.findById(playlistid)
    if(!playlist){
        throw new ApiError(400,"playlist not exist")
    }

    if(req.user._id.toString() !== playlist.owner.toString()){
        throw new ApiError(404,"unauthorized access")
    }

    const video = await Video.findById(videoid)
    if(!video){
        throw new ApiError(400,"video not exist")
    }


    console.log(video);
    playlist.video.push(video._id)
    await playlist.save()

    return res.status(200)
    .json(new ApiResponse(200,playlist.video,"video is added successfully"))

})

const removeVideo = asyncHandler( async(req,res) =>{
    const {playlistid, videoid} = req.params
    if(!playlistid || !videoid){
        throw new ApiError(400,"playlist id and video id is required")
    }

    const playlist = await Playlist.findById(playlistid)
    if(!playlist){
        throw new ApiError(400,"playlist not exist")
    }

    if(req.user._id.toString() !== playlist.owner.toString()){
        throw new ApiError(404,"unauthorized access")
    }

    const video = await Video.findById(videoid)
    if(!video){
        throw new ApiError(400,"video not exist")
    }

    const index = playlist.video.findIndex( i => i.toString() === videoid)
    console.log("[*] index: ",index);
    if(index === -1){
        throw new ApiError(400,"video is not in playlist")
    }

    playlist.video.splice(index,1)
    await playlist.save()

    return res.status(200)
    .json(new ApiResponse(200,playlist.video,"video removed successfully"))
    
})

const getPlaylistById = asyncHandler( async(req,res) =>{
    const {playlistid} = req.params
    if(!playlistid){
        throw new ApiError(400,"playlist id is required")
    }

    const playlist = await Playlist.findById(playlistid)
    if(!playlist){
        throw new ApiError(400,"playlist does not exist")
    }

    return res.status(200)
    .json(new ApiResponse(200,playlist,"playlist fetched successfully"))
})

const getPlaylistByUser = asyncHandler( async(req,res) =>{
    const {userid} = req.params
    if(!userid){
        throw new ApiError(400,"user id required")
    }

    const playlists = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(userid)
            }
        },
        {
            $lookup:{
                from:"playlists",
                localField:"_id",
                foreignField:"owner",
                as:"playlis",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            name:1,
                            description:1
                        }
                    }
                ]
            }
        },
        {
            $project:{
                playlis:1
            }
        }
    ])

    console.log("[*] playlists: ",playlists);
    
    if(playlists.length === 0){
        throw new ApiError(400,"no playlist")
    }

    return res.status(200)
    .json(new ApiResponse(200,playlists,"user playlist fetched successfully"))
})

const updatePlaylist = asyncHandler( async(req,res) =>{
    const {name, description} = req.body
    const {playlistid} = req.params
    if(!name || !description){
        throw new ApiError(400,"name and description is required")
    }

    if(!playlistid){
        throw new ApiError(400,"playlist id is required")
    }

    const playlist = await Playlist.findById(playlistid)
    if(!playlist){
        throw new ApiError(400,"playlist not exist")
    }

    if(req.user._id.toString() !== playlist.owner.toString()){
        throw new ApiError(404,"unauthorized access")
    }

    playlist.name = name
    playlist.description = description
    await playlist.save()

    return res.status(200)
    .json(new ApiResponse(200,playlist,"playlist updated successfully"))

})

const deletePlaylist = asyncHandler( async(req,res) =>{
    const {playlistid} = req.params
    if(!playlistid){
        throw new ApiError(400,"playlist id is required")
    }

    const playlistdeleted = await Playlist.findOneAndDelete(
        {_id:playlistid,owner:req.user._id}
    )

    if(!playlistdeleted){
        throw new ApiError(404,"unauthorized access")
    }

    return res.status(200)
    .json(new ApiResponse(200,playlistdeleted,"playlist deleted successfully"))
})

export {createPlaylist, addVideo, getPlaylistById, getPlaylistByUser, updatePlaylist, deletePlaylist, removeVideo}