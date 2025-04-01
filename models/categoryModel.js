const mongoose = require('mongoose');

//schema 
const CategorySchema = mongoose.Schema({
    name : String
})

//modeling
const CategoryModel = new mongoose.model('category' , CategorySchema)


module.exports = CategoryModel;