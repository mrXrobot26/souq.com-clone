const mongoose = require('mongoose')

const subCategorySchema = mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Sub Category Name Required'],
        minLength: [3, 'Min Length of Category Must be 3'],
        maxLength: [32, 'Max Length of Category Must be 32'],
        unique: [true, 'Category name must be unique']
    },
    slug : {
        type: String,  
        required: [true, 'Slag Required'],
        minLength: [3, 'Min Length of Category Must be 3'],
        maxLength: [32, 'Max Length of Category Must be 32'],
        unique: [true, 'Category name must be unique']
    },
    //ref to category
    category :{
        type : mongoose.Schema.ObjectId,
        ref :'Category',
        required : [true ,"Category reference is required"]
    }
}   
    ,{
        timestamps : true
    }
)

const subCategory = mongoose.model('SubCategory' , subCategorySchema)

module.exports = subCategory