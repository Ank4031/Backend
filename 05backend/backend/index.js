import express from "express"
import cors from "cors"

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.post("/api/login",(req,res)=>{
    console.log(req.body);
    res.send("hello")
})

app.post("/api/register",(req,res)=>{
    console.log(req.body);
    res.send("user registered")
})

app.listen(3000,()=>{
    console.log("[*] server started on: ",3000);
})
