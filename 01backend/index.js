require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello Ankit')
})

app.get('/about', (req, res) => {
  res.send('Ankit works on the backend')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})