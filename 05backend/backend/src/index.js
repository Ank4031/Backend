import { app } from "./app.js";
import dbConnect from "./db/Db.js"

dbConnect()
.then(()=>{
    app.listen(3000,()=>{
        console.log("[*] server started on: ",3000);
    })
})
.catch((e)=>console.log("[*] db canntot connect !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!>"))


