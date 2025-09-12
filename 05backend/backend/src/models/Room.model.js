import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  passcode:{
    type:String,
    required:true
  },
  creator:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

roomSchema.pre("save",async function(next){
    if(!this.isModified("passcode")) return next();
    this.passcode = bcrypt.hashSync(this.passcode,5);
    next();
})

roomSchema.methods.checkPasscode = async function(passcode){
    return bcrypt.compareSync(passcode,this.passcode);
}

export const Room = mongoose.model("Room", roomSchema);
