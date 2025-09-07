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
        email:{
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

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hashSync(this.password,10);
    next();
})

userSchema.methods.checkPassword = async function(password){
    return bcrypt.compareSync(password,this.password);
}

userSchema.methods.genAccessToken = async function(){
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

userSchema.methods.genRefreshToken = async function(){
    return await jwt.sign({
        id: this._id,
        name: this.name,
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: "6d"
    })
}

export const User = mongoose.model("User",userSchema)