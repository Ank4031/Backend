import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        username:{
            type: String,
            required: true,
            unique: true
        },
        emial:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true,
        },
        refreshtoken:{
            type: String,
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save",async function(){
    if(this.isModified(this.password)) return next();
    this.password = bcrypt.hashSync(this.password,10);
    next();
})

userSchema.method.checkPassword = async function(password){
    return bcrypt.compareSync(password,this.password);
}

userSchema.method.genAccessToken = async function(){
    return await jwt.sign({
        id: this._id,
        name: this.name,
        username: this.username,
        email: this.email,
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: "1d"
    })
}

userSchema.method.genRefreshToken = async function(){
    return await jwt.sign({
        id: this._id,
        name: this.name,
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: "6d"
    })
}

export const User = mongoose.model("User",userSchema)