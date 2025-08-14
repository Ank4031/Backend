require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/ankit',(req,res)=>{
    res.send('<h1>This is ankit and his first backend experience.</h1>')
})

app.get('/lamba',(req,res)=>{
    res.send('<h2>Awasom</h2>')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})