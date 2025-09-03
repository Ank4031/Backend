import { Router } from "express";
import { verifyuser } from "../Middleware/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../Controllers/dashboard.controller.js";

const dashboardRoute = Router()

dashboardRoute.route("/videos").get(
    verifyuser,
    getChannelVideos
)

dashboardRoute.route("/stats").get(
    verifyuser,
    getChannelStats
)

export default dashboardRoute