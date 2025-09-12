import { ApiError } from "../Utilities/ApiError.js";
import { AsyncHandler } from "../Utilities/AsyncHandler.js";
import { ApiResponce } from "../Utilities/ApiResponce.js";
import { Room } from "../models/Room.model.js";
import { Joinedrooms } from "../models/Joinedrooms.model.js";

const createRoom = AsyncHandler(async(req,res)=>{
    const {roomname,passcode} = req.body
    const {userid} = req.params
    if(!roomname){
        throw new ApiError(400,"room name is required")
    }

    //check if the room already exist
    const currroom = await Room.findOne({
        name: roomname
    })

    if(currroom){
        throw new ApiError(400,"room already exist use a different name")
    }

    //create the new room
    const room = await Room.create({
        name: roomname,
        passcode,
        creator: userid
    })

    if(!room){
        throw new ApiError(400,"cannot create a room")
    }

    //join the new room
    const joinroom = await Joinedrooms.create({
        name:room.name,
        room: room._id,
        user: userid
    })

    if(!joinroom){
        throw new ApiError(400,"cannot join a room")
    }

    return res.status(200)
    .json(new ApiResponce(200,{},"new room created"))
})

const joinRoom = AsyncHandler(async(req,res)=>{
    const {passcode, roomname} = req.body
    
    //check for passcode
    if(!passcode){
        throw new ApiError(400,"passcode is required")
    }

    //check if room exist
    const room = await Room.findOne({
        name:roomname
    })

    if(!room){
        throw new ApiError(400,"no room available with this name")
    }

    console.log("[*] join room: ",room._id);

    //check if passcode is correct
    if(!(await room.checkPasscode(passcode))){
        throw new ApiError(400,"passcode is incorrect")
    }

    //check if user already joined
    const joinedroom = await Joinedrooms.find({
        $and:[{room:room._id}, 
        {user:req.user._id}]
    })
    console.log(joinedroom);
    if(joinedroom.length > 0){
        throw new ApiError(400,"room already joined")
    }

    //Join the room
    const joinroom = await Joinedrooms.create({
        name:room.name,
        room:room._id,
        user:req.user._id
    })

    if(!joinroom){
        throw new ApiError(400,"cannot join the room")
    }

    return res.status(200)
    .json(new ApiResponce(200,{},"room joined successfully"))
})

const getRooms = AsyncHandler(async(req,res)=>{
    // console.log("[*] user: ",req.user._id);
    
    const rooms = await Joinedrooms.find({
        user:req.user._id
    })

    // console.log("[*] room: ",rooms._id);
    
    if(!rooms){
        throw new ApiError(400,"rooms cannot be fetched")
    }
    
    return res.status(200)
    .json(new ApiResponce(200,rooms,"all rooms are fetched"))
})

const deleteroom = AsyncHandler(async(req,res)=>{
    const {roomid} = req.params
    if(!roomid){
        throw new ApiError(400,"user id is required")
    }

    const room = await Room.findById({
        _id:roomid
    })

    if(!room){
        throw new ApiError(400,"no such room exist")
    }

    if(room.creator.toString() === req.user._id.toString()){
        console.log("deleting for the creator");
        
        const deleteuserroom = await Joinedrooms.deleteMany({
            user:req.user._id
        })
        if(!deleteuserroom){
            throw new ApiError(400,"cannot delete room")
        }

        const deleteownerroom = await Room.deleteOne({
            creator:creatorid
        }) 
        if(!deleteownerroom){
            throw new ApiError(400,"cannot delete the room from origin")
        }

        return res.status(200)
        .json(new ApiResponce(200,{},"room deleted"))

    }else{
        console.log("deleting for the joined user");
        
        const deleteuserroom = await Joinedrooms.deleteMany({
            user:req.user._id
        })

        if(!deleteuserroom){
            throw new ApiError(400,"cannot delete room")
        }

        return res.status(200)
        .json(new ApiResponce(200,{},"room deleted from joined rooms"))
    }

})

export {createRoom, getRooms, joinRoom, deleteroom}