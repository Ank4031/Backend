import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(cookieParser())

import UserRoute from "./routes/User.route.js";
import RoomRoute from "./routes/Room.route.js";
import MessageRoute from "./routes/Message.route.js";

app.use("/api/v1/user",UserRoute)
app.use("/api/v1/room",RoomRoute)
app.use("/api/v1/message",MessageRoute)

app.use((err, req, res, next) => {
  console.error("[ERROR]:", err);

  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || []
  });
});


export {app}
