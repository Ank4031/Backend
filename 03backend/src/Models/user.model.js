import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // URL to the avatar image(cloudinary)
        required: true,
    },
    coverimg: {
        type: String,
    },
    watchhistory: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Video'
        }
    ],
    password: {
        type: String,
        required: [true,"password is required"],
    },
    refreshtoken: {
        type: String
    },
},{timestamps:true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
})

userSchema.methods.isPasswordCorrect = async function(pass){
    return await bcrypt.compare(pass, this.password);
}

userSchema.methods.genrateAccessToken = async function(){
    return await jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
);
}

userSchema.methods.genrateRefreshToken = async function(){
    return await jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
);
}


export const User = mongoose.model('User', userSchema);

