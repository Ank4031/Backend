import { Router } from "express";
import { changeCurrentPassword, getChannelUserProfile, getCurrentUser, getUserHistory, 
    loginUser, logoutUser, refreshAccessToken, registerUser, 
    updateAccountDetails, updateUserAvatar, updateUserCoverimg } from "../Controllers/user.controller.js";
import { upload } from "../Middleware/multer.middleware.js";
import { verifyuser } from "../Middleware/auth.middleware.js";

const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimg",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(
    loginUser
)

router.route("/logout").post(
    verifyuser,
    logoutUser
)

router.route("/refresh-token").post(
    refreshAccessToken
)

router.route("/change-password").post(
    verifyuser,
    changeCurrentPassword
)

router.route("/get-user").get(
    verifyuser,
    getCurrentUser
)

router.route("/update-avatar").patch(
    verifyuser,
    upload.single("avatar"),
    updateUserAvatar
)

router.route("/update-coverimg").patch(
    verifyuser,
    upload.single("coverimg"),
    updateUserCoverimg
)

router.route("/update-account").patch(
    verifyuser,
    updateAccountDetails
)

router.route("/history").get(
    verifyuser,
    getUserHistory
)

router.route("/channel-profile/:username").get(
    verifyuser,
    getChannelUserProfile
)

export default router