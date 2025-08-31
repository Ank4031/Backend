import { Router } from "express"
import { verifyuser } from "../Middleware/auth.middleware.js"
import { CreateComment, DeleteComment, UpdateComment } from "../Controllers/comment.controller.js"

const commentRoute = Router()

commentRoute.route("/CreateComment/:video").post(
    verifyuser,
    CreateComment
)

commentRoute.route("/update-comment/:commentid").patch(
    verifyuser,
    UpdateComment
)

commentRoute.route("/delete/:commentid").delete(
    verifyuser,
    DeleteComment
)