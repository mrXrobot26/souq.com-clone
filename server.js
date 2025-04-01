const express = require('express')
const env = require('dotenv')
const morgen = require('morgan')
const mongoose = require('mongoose');
const {schema} = require('mongoose');

env.config();
const app = express();

const port = process.env.PORT || 3000;
app.listen(port , ()=> {
    console.log(`app runinng on port : ${port}`)
})


// middelware
app.use(express.json());
if (process.env.NODE_ENV == 'development') {
    console.log(`Mode : ${process.env.NODE_ENV}`)
    app.use(morgen('dev'))
    console.log("======================================")
}


//db
db_connect().then(() => console.log("Database connected successfully")).catch((err) => console.error("Database error:", err));
async function db_connect() {
    await mongoose.connect(process.env.db_application);
}

//schema 
const CategorySchema = mongoose.Schema({
    name : String
})

//modeling
const CategoryModel = new mongoose.model('category' , CategorySchema)


//routes
app.post('/', async (req, res) => {
    try {
        const nameFromReq = req.body.name;
        const newCategory = new CategoryModel({ name: nameFromReq });
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        console.error("Error saving category:", err);
        res.status(500).json({ error: "Failed to save category" });
    }
});

app.get('/',(req , res) =>
{
    res.json("our api v3")
})