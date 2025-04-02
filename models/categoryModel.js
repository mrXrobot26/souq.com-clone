const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//schema 
const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'Category Name Required'],
        minLength: [3, 'Min Length of Category Must be 3'],
        maxLength: [32, 'Max Length of Category Must be 32'],
        unique: [true, 'Category name must be unique']
    } ,
    // Category Name A and B => a-and-b this is Slag
    slag: {
        type: String,  // Missing type was causing the error
        required: [true, 'Slag Required'],
        minLength: [3, 'Min Length of Category Must be 3'],
        maxLength: [32, 'Max Length of Category Must be 32'],
        unique: [true, 'Category name must be unique']
    },
    image : String
},{
    timestamps: true // Adds createdAt and updatedAt fields automatically
})

//modeling
const CategoryModel = mongoose.model('category' , CategorySchema)
// explain ↑↑↑↑↑↑
// The new keyword is unnecessary when calling mongoose.model() because:
// mongoose.model() is a factory function, not a constructor
// It already creates and returns a new model instance internally
// Let me explain with code examples:
// ❌ Incorrect - using 'new'
// const CategoryModel = new mongoose.model('category', CategorySchema)

// // ✅ Correct - without 'new'
// const CategoryModel = mongoose.model('category', CategorySchema)


module.exports = CategoryModel;