const express = require('express')
const env = require('dotenv')
const morgen = require('morgan')
env.config();


const app = express();

if(process.env.NODE_ENV == 'development'){
    console.log(`Mode : ${process.env.NODE_ENV}`)
    app.use(morgen('dev'))
    console.log("======================================")
}

const port = process.env.PORT || 3000;

app.listen(port , ()=> {
    console.log(`app runinng on port : ${port}`)
})

app.get('/',(req , res) =>
{
    res.json("our api v3")
})