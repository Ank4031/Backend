import { Router } from "express";
import { UserVerify } from "../middlewares/auth.middleware.js";
import { addMessage, deleteAll, readMessage } from "../controller/Message.controller.js";

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

export default MessageRoute
