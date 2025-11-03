import { ApiError } from "../Utilities/ApiError.js"
import { ApiResponce } from "../Utilities/ApiResponce.js"
import { AsyncHandler } from "../Utilities/AsyncHandler.js"
import { Message } from "../models/Message.model.js"
import redisClient, { getCache, setCache, delCache } from "../Utilities/Redis.js";


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


    try {
        // Get existing cached messages if available
        const cacheKey = `messages:${roomid}`;
        const cachedMessages = await getCache(cacheKey);

        let updatedMessages = [];
        if (cachedMessages) {
            // Parse if stored as string (common for Redis)
            const parsedMessages = typeof cachedMessages === "string"
                ? JSON.parse(cachedMessages)
                : cachedMessages;

            updatedMessages = [...parsedMessages, newmsg];
        } else {
            // No cache found — start a new array
            updatedMessages = [newmsg];
        }

        // Save updated messages back to cache (TTL: 5 minutes)
        await setCache(cacheKey, updatedMessages, 300);
        console.log("🧠 Redis cache updated for room:", roomid);
    } catch (error) {
        console.error("⚠️ Redis cache update failed:", error.message);
    }

    return res.status(200)
    .json(new ApiResponce(200,newmsg,"message is stored"))
})

const readMessage = AsyncHandler(async(req,res)=>{
    const { roomid } = req.params;
    if (!roomid) {
        throw new ApiError(400, "roomid is needed");
    }

    // Check Redis cache first
    const cachedMessages = await getCache(`messages:${roomid}`);
    if (cachedMessages) {
        console.log("📦 Messages fetched from Redis cache");
        return res
        .status(200)
        .json(new ApiResponce(200, cachedMessages, "messages fetched from cache"));
    }

    // If not cached, fetch from DB
    const messages = await Message.find({ room: roomid });
    if (!messages) {
        throw new ApiError(400, "cannot get messages");
    }

    // Save in cache (TTL: 5 minutes)
    await setCache(`messages:${roomid}`, messages, 30000);

    return res
        .status(200)
        .json(new ApiResponce(200, messages, "all messages are fetched"));


    //message read without redis cache
    // const {roomid} = req.params
    // //check for roomid
    // if(!roomid){
    //     throw new ApiError(400,"roomid is needed")
    // }

    // //get all the messages form the room
    // const messages = await Message.find({
    //     room:roomid
    // })

    // if(!messages){
    //     throw new ApiError(400,"cannot get messages")
    // }

    // return res.status(200)
    // .json(new ApiResponce(200,messages,"all messages are fetched"))
})

const deleteAll = AsyncHandler(async (req, res) => {
    const { roomid } = req.params;
    if (!roomid) {
        throw new ApiError(400, "room id is required");
    }

    // Delete all messages for the given room
    const del = await Message.deleteMany({ room: roomid });
    if (!del) {
        throw new ApiError(400, "messages cannot be deleted");
    }

    // 🧹 Clear Redis cache for this room
    await delCache(`messages:${roomid}`);

    return res.status(200)
        .json(new ApiResponce(200, {}, "all messages are deleted"));
});

const deleteMsg = AsyncHandler(async (req, res) => {
    const { msgid } = req.params;

    if (!msgid) {
        throw new ApiError(400, "message id is required");
    }

    // Delete the message from DB
    const msgdel = await Message.findOneAndDelete({ _id: msgid });

    if (!msgdel) {
        throw new ApiError(400, "message is not deleted");
    }

    // 🔄 Update / Invalidate Redis cache for this room
    try {
        const cacheKey = `messages:${msgdel.room}`;
        const cached = await getCache(cacheKey);

        if (cached) {
            const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
            const updated = parsed.filter((m) => m._id !== msgid);
            await setCache(cacheKey, updated, 3000);
            console.log(`🗑️ Cache updated after deleting message in room: ${msgdel.room}`);
        } else {
            // If no cache, just ignore
            console.log("ℹ️ No cache found to update after delete");
        }
    } catch (err) {
        console.error("⚠️ Redis cache update (deleteMsg) failed:", err.message);
    }

    return res.status(200).json(new ApiResponce(200, {}, "message is deleted"));
});

const updateMsg = AsyncHandler(async (req, res) => {
    const { msgid } = req.params;
    const { text } = req.body;

    const message = await Message.findByIdAndUpdate(
        msgid,
        { $set: { text } },
        { new: true }
    );

    if (!message) {
        throw new ApiError(400, "message cannot be updated");
    }

    // 🔄 Update Redis cache for the room
    try {
        const cacheKey = `messages:${message.room}`;
        const cached = await getCache(cacheKey);

        if (cached) {
            const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
            const updated = parsed.map((m) =>
                m._id === msgid ? { ...m, text: message.text } : m
            );
            await setCache(cacheKey, updated, 3000);
            console.log(`✏️ Cache updated after message update in room: ${message.room}`);
        } else {
            console.log("ℹ️ No cache found to update after message edit");
        }
    } catch (err) {
        console.error("⚠️ Redis cache update (updateMsg) failed:", err.message);
    }

    return res.status(200).json(new ApiResponce(200, message, "message is updated"));
});

export {addMessage, readMessage, deleteAll, deleteMsg, updateMsg}