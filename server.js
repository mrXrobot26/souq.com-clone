const express = require('express')
const env = require('dotenv')
const morgen = require('morgan')
const mongoose = require('mongoose')



env.config();
const app = express();


db_connect().then(() => console.log("Database connected successfully")).catch((err) => console.error("Database error:", err));
async function db_connect() {
    await mongoose.connect(process.env.db_application);
}

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