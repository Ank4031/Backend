import { Router } from "express";
import { createTweet, deleteTweet, getTweet, updateTweet } from "../Controllers/tweet.controller.js";
import { verifyuser } from "../Middleware/auth.middleware.js";

const tweetRoute = Router()

tweetRoute.route("/create").post(
    verifyuser,
    createTweet
)

tweetRoute.route("/get/:tweetid").get(
    getTweet
)

tweetRoute.route("/update/:tweetid").patch(
    verifyuser,
    updateTweet
)

tweetRoute.route("/delete/:tweetid").delete(
    verifyuser,
    deleteTweet
)

export default tweetRoute