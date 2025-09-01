import { Router } from "express";
import { verifyuser } from "../Middleware/auth.middleware.js"
import { deleteVideo, getVideo, publishAVideo, togglePublishStatus, updateVideo } from "../Controllers/video.controller.js";
import { upload } from "../Middleware/multer.middleware.js";

const videoRoute = Router()
videoRoute.route("/publish").post(
    verifyuser,
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
)

videoRoute.route("/get-video/:videoid").get(
    getVideo
)

videoRoute.route("/update/:videoid").patch(
    verifyuser,
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    updateVideo
)

videoRoute.route("/delete/:videoid").delete(
    verifyuser,
    deleteVideo
)

videoRoute.route("/toggle/:videoid").patch(
    verifyuser,
    togglePublishStatus
)

export default videoRoute