import { Router } from "express";
import { UserVerify } from "../middlewares/auth.middleware.js";
import { addMessage, deleteAll, deleteMsg, readMessage, updateMsg } from "../controller/Message.controller.js";

const MessageRoute = Router()

MessageRoute.route("/add/:roomid").post(
    UserVerify,
    addMessage
)

MessageRoute.route("/read/:roomid").get(
    UserVerify,
    readMessage
)

MessageRoute.route("/deleteall/:roomid").delete(
    UserVerify,
    deleteAll
)

MessageRoute.route("/deletemsg/:msgid").delete(
    UserVerify,
    deleteMsg
)

MessageRoute.route("/updatemsg/:msgid").patch(
    UserVerify,
    updateMsg
)

export default MessageRoute
