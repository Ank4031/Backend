import express from "express"
import { WebSocketServer } from "ws"

const app = express()

const server = app.listen(3000,()=>{
    console.log("[*] server is starting.....");
})

const wss = new WebSocketServer({server});

wss.on("connection",(wss,req)=>{
    console.log("client connected: ",req.socket.remoteAddress);

    wss.on("message",(data)=>{
        console.log("[*] data: ",data.toString());
        wss.send("thanku")
    })

    wss.on("close",()=>console.log("connection closed")
    )
});




