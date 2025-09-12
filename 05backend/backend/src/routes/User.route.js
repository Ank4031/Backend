import { Router } from "express";
import { CheckLogin, getUsers, LoginUser, RegisterUser, UserLogout } from "../controller/User.controller.js";
import { UserVerify } from "../middlewares/auth.middleware.js";

const UserRoute = Router()

UserRoute.route("/register").post(
    RegisterUser
)

UserRoute.route("/login").post(
    LoginUser
)

UserRoute.route("/checklogin").get(
    UserVerify,
    CheckLogin
)

UserRoute.route("/getusers").get(
    UserVerify,
    getUsers
)

UserRoute.route("/logout").post(
    UserVerify,
    UserLogout
)

export default UserRoute