import { Router } from "express";
import { verifyuser } from "../Middleware/auth.middleware.js"
import { deleteVideo, getVideo, publishAVideo, togglePublishStatus, updateVideo } from "../Controllers/video.controller.js";
import { upload } from "../Middleware/multer.middleware.js";

const videoRouter = Router()
videoRouter.route("/publish").post(
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

videoRouter.route("/get-video/:videoid").get(
    getVideo
)

videoRouter.route("/update/:videoid").patch(
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

videoRouter.route("/delete/:videoid").delete(
    verifyuser,
    deleteVideo
)

videoRouter.route("/toggle/:videoid").patch(
    verifyuser,
    togglePublishStatus
)

export default videoRouter