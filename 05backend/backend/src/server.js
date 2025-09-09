import { WebSocketServer } from 'ws'

export default function websocket(server){
    const wss = new WebSocketServer({server});

    wss.on("connection",(ws)=>{
        console.log("[*] New WebSocket client connected");

        ws.on("message",(message)=>{
            console.log("[*] message: ",message.toString());
            ws.send("message recieved")
        })

        ws.on("close", () => {
            console.log("[*] Client disconnected");
        });
    })
}

