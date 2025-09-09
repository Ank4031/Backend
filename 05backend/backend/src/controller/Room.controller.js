import { ApiError } from "../Utilities/ApiError.js";
import { AsyncHandler } from "../Utilities/AsyncHandler.js";
import { ApiResponce } from "../Utilities/ApiResponce.js";
import { Room } from "../models/Room.model.js";

const createRoom = AsyncHandler(async(req,res)=>{
    const {roomname} = req.params
    if(!roomname){
        throw new ApiError(400,"room name is required")
    }

    const currroom = await Room.findOne({
        name: roomname
    })

    if(currroom){
        throw new ApiError(400,"room already exist use a different name")
    }

    const room = await Room.create({
        name: roomname
    })

    if(!room){
        throw new ApiError(400,"cannot create a room")
    }

    return res.status(200)
    .json(new ApiResponce(200,{},"new room created"))
})

const getRooms = AsyncHandler(async(req,res)=>{
    const rooms  = await Room.find()
    if(!rooms){
        throw new ApiError(400,"no rooms are found")
    }
    console.log("[*]rooms: ",rooms);
    
    return res.status(200)
    .json(new ApiResponce(200,rooms,"all rooms are fetched"))
})

export {createRoom, getRooms}