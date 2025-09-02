import {Router} from "express"
import { getSubscribedChannel, getSubscribers, toggleSubscription } from "../Controllers/subscription.controller.js"
import { verifyuser } from "../Middleware/auth.middleware.js"

const subcriptionRoute = Router()

subcriptionRoute.route("/subcribedchannel").get(
    verifyuser,
    getSubscribedChannel
)

subcriptionRoute.route("/subcribers").get(
    verifyuser,
    getSubscribers
)

subcriptionRoute.route("/toggle/:channelid").post(
    verifyuser,
    toggleSubscription
)

export default subcriptionRoute