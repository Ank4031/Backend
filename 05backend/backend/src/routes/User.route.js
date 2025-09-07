import { Router } from "express";
import { LoginUser, RegisterUser } from "../controller/User.controller.js";

const UserRoute = Router()

UserRoute.route("/register").post(
    RegisterUser
)

UserRoute.route("/login").post(
    LoginUser
)
export default UserRoute