import { Router } from "express"
import { verifyuser } from "../Middleware/auth.middleware.js"
import { CreateComment, DeleteComment, UpdateComment } from "../Controllers/comment.controller.js"

const commentRoute = Router()

commentRoute.route("/create/:video").post(
    verifyuser,
    CreateComment
)

commentRoute.route("/update/:commentid").patch(
    verifyuser,
    UpdateComment
)

commentRoute.route("/delete/:commentid").delete(
    verifyuser,
    DeleteComment
)

export default commentRoute