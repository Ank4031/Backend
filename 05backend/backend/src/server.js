import { WebSocketServer } from 'ws'

export default function websocket(server){
    const clients = new Map();
    const wss = new WebSocketServer({server});

    wss.on("connection",(ws)=>{
        console.log("[*] New WebSocket client connected");

        ws.on("message",(message)=>{
            const data = JSON.parse(message);
            
            if(data.type === "join"){
                clients.set(ws,data.room)
                console.log("client,connected");
            }

            if(data.type === "message"){
                console.log("working on new message");
                console.log("[*] room: ",data.room);
                wss.clients.forEach(client=>{
                    console.log("checking for roomid: ",clients.get(client));
                    if(clients.get(client) === data.room){
                        console.log("sending meg to client:");
                        client.send(JSON.stringify(data))
                    }
                })
            }
            
        })

        ws.on("close", () => {
            console.log("[*] Client disconnected");
        });
    })
}

