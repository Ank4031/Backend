import express from 'express';


const app = express();

app.get('/',(req,res)=>{
    res.send("server is ready");
});

//get a list of 5 jokes

app.get('/api/jokes',(req,res)=>{
    let joks = [
        {
            id:"hahaha"
        },
        {
            id:"very funny"
        },
    ]
    res.send(joks)
})

const port = 4000;
app.listen(port,()=>{
    console.log(`server at http://localhost:${port}`);    
})