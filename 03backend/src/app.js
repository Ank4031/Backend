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
import videoRouter from './Routes/video.route.js';

//routers declaration
app.use("/api/v1/users", router)
app.use("/api/v1/comment",commentRoute)
app.use("/api/v1/video",videoRouter)

export {app}