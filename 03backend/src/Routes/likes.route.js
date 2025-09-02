import { Router } from "express";
import { verifyuser } from "../Middleware/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../Controllers/likes.controller.js";

const likesRoute = Router()

likesRoute.route("/video/:videoid").patch(
    verifyuser,
    toggleVideoLike
)

likesRoute.route("/comment/:commentid").patch(
    verifyuser,
    toggleCommentLike
)

likesRoute.route("/tweet/:tweetid").patch(
    verifyuser,
    toggleTweetLike
)

likesRoute.route("/liked-videos").get(
    verifyuser,
    getLikedVideos
)

export default likesRoute