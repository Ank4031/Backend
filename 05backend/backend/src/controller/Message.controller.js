import { ApiError } from "../Utilities/ApiError.js"
import { ApiResponce } from "../Utilities/ApiResponce.js"
import { AsyncHandler } from "../Utilities/AsyncHandler.js"
import { Message } from "../models/Message.model.js"


const addMessage = AsyncHandler(async(req,res)=>{
    const {roomid} = req.params
    const {message, userid} = req.body

    console.log("[*] user id: ",userid);

    if(!(roomid && message && userid)){
        throw new ApiError(400,"message, roomid and userid are required")
    }

    const msg = await Message.create({
        sender: userid,
        text: message,
        room: roomid
    })

    if(!msg){
        throw new ApiError(400,"message cannot send")
    }

    const newmsg = await Message.findById(msg._id)

    return res.status(200)
    .json(new ApiResponce(200,newmsg,"message is stored"))
})

const readMessage = AsyncHandler(async(req,res)=>{
    const {roomid} = req.params
    if(!roomid){
        throw new ApiError(400,"roomid is needed")
    }

    const messages = await Message.find({
        room:roomid
    })

    if(!messages){
        throw new ApiError(400,"cannot get messages")
    }

    return res.status(200)
    .json(new ApiResponce(200,messages,"all messages are fetched"))
})

const deleteAll = AsyncHandler(async(req,res)=>{
    const {roomid} = req.params
    if(!roomid){
        throw new ApiError(400,"room id is required")
    }

    const del = await Message.deleteMany({room:roomid})
    if(!del){
        throw new ApiError(400,"messages cannot be deleted")
    }

    return res.status(200)
    .json(new ApiResponce(200,{},"all messages are deleted"))
})

export {addMessage, readMessage, deleteAll}