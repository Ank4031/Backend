import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const joinedroomsSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required:true
        },
        room:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room"
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps:true
    }
)

export const Joinedrooms = mongoose.model("Joinedrooms",joinedroomsSchema)