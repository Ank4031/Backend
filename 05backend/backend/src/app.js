import express from "express"
import cors from "cors"
import cookieParser from "cookie-Parser"

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }))
app.use(cookieParser())

import UserRoute from "./routes/User.route.js";

app.use("/api/v1/user",UserRoute)

export {app}
