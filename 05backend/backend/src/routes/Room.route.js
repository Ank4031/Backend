import { Router } from "express";
import { createRoom, getRooms } from "../controller/Room.controller.js";
import { UserVerify } from "../middlewares/auth.middleware.js";

const RoomRoute = Router()

RoomRoute.route("/create/:roomname").post(
    UserVerify,
    createRoom
)

RoomRoute.route("/getrooms").get(
    UserVerify,
    getRooms
)

export default RoomRoute

