import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: false,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",   
      required: false,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
