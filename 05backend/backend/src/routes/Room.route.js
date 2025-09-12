import { Router } from "express";
import { createRoom, deleteroom, getRooms, joinRoom } from "../controller/Room.controller.js";
import { UserVerify } from "../middlewares/auth.middleware.js";

const RoomRoute = Router()

RoomRoute.route("/create/:userid").post(
    UserVerify,
    createRoom
)

RoomRoute.route("/getrooms").get(
    UserVerify,
    getRooms
)

RoomRoute.route("/joinroom").post(
    UserVerify,
    joinRoom
)

RoomRoute.route("/delete/:roomid").delete(
    UserVerify,
    deleteroom
)

export default RoomRoute

