import { asyncHandler } from "../Utilities/asyncHandler.js"
import { ApiError } from "../Utilities/ApiError.js"
import { ApiResponse } from "../Utilities/ApiResponse.js"
import { User } from "../Models/user.model.js"
import { Comment } from "../Models/comment.model.js"

const CreateComment = asyncHandler( async(req, res) =>{
    
    const {video} = req.params
    const {content} = req.body
    if (!video || !content){
        throw new ApiError(400,"content and video id is required")
    }

    const user = await User.findById(req.user?._id)

    if(!user){
        throw new ApiError(404,"unauthorized user")
    }

    const usercomment = await Comment.create({
        content,
        video,
        owner: user._id
    })

    if(!usercomment){
        throw new ApiError(400,"invalid content")
    }

    return res.status(200)
    .json(new ApiResponse(200,usercomment,"comment published sucessfully"))
})

const UpdateComment = asyncHandler( async(req, res) =>{
    const { commentid } = req.params
    const { content } = req.body

    if (!commentid || !content){
        throw new ApiError(400,"comment id and content is required")
    }

    const comment = await Comment.findById(commentid)

    if (!comment){
        throw new ApiError(400,"no such comment found")
    }

    console.log("-------------------------------------------");
    
    console.log("user: ",req.user._id);
    console.log("comment owner: ",comment.owner);

    console.log("-------------------------------------------");
    
    if(req.user._id.toString() !== comment.owner.toString()){
        throw new ApiError(404,"unauthorized comment access")
    }

    comment.content = content
    await comment.save()

    return res.status(200)
    .json( new ApiResponse(200,comment,"comment updated successfully"))

})

const DeleteComment = asyncHandler( async(req, res) =>{
    const {commentid} = req.params

    if(!commentid){
        throw new ApiError(400,"comment id is required")
    }

    const comment = await Comment.findById(commentid)
    if(!comment){
        throw new ApiError(400,"no such comment is found")
    }

    if(req.user._id.toString() !== comment.owner.toString()){
        throw new ApiError(404,"unauthorized comment access")
    }

    await comment.deleteOne()

    return res.status(200)
    .json(new ApiResponse(200,{},"comment deleted sucessfully"))
})

export {CreateComment, UpdateComment, DeleteComment}