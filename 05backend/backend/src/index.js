import { app } from "./app.js";
import dbConnect from "./db/Db.js"
import websocket from "./server.js";

dbConnect()
.then(()=>{
    const server = app.listen(3000,()=>{
        console.log("[*] server started on: ",3000);
    })

    websocket(server);
})
.catch((e)=>console.log("[*] db canntot connect !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!>"))

