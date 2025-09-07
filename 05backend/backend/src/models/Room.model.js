import mongoose from "mongoose";


const roomSchema = new mongoose.Schema({
  name: {
    type: String
  },
  members: [
    { type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }
  ]
}, { timestamps: true });

export const Room = mongoose.model("Room", roomSchema);
