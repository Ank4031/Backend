import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: '16kb'
}))
app.use(express.urlencoded())
app.use(express.static('public'));
app.use(cookieParser());



//routes
import router from './Routes/user.route.js';
import commentRoute from './Routes/comment.route.js';
import videoRoute from './Routes/video.route.js';
import tweetRoute from './Routes/tweet.route.js';
import subcriptionRoute from './Routes/subsciption.route.js';
import playlistRoute from './Routes/playlist.route.js';
import likesRoute from './Routes/likes.route.js';
import dashboardRoute from './Routes/dashboard.route.js';


//routers declaration
app.use("/api/v1/users", router)
app.use("/api/v1/comment",commentRoute)
app.use("/api/v1/video",videoRoute)
app.use("/api/v1/tweet",tweetRoute)
app.use("/api/v1/sub",subcriptionRoute)
app.use("/api/v1/playlist",playlistRoute)
app.use("/api/v1/likes",likesRoute)
app.use("/api/v1/dashboard",dashboardRoute)

export {app}