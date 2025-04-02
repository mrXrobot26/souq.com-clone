const CategoryModel = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler')




//  @desc   Get Category by id
//  @route  GET /api/v1/categories/id
//  @access public
const getCategoryById = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const category = await CategoryModel.findById(id);
    if(category===null){
        res.status(404).json({
            status : 'Not Found',
        })
    }
    res.status(201).json({
        status : 'success',
        data: category
    })
})


//  @desc   Get All Categories
//  @route  GET /api/v1/categories
//  @access public
const getCategories = asyncHandler(async (req , res)=>{
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page -1) * limit
    const categories = await CategoryModel.find({}).skip(skip).limit(limit)
    res.status(201).json({
        status : 'success',
        Page : page, 
        results : categories.length,
        data: categories
    })
})  

//  @desc   create category
//  @route  POST /api/v1/categories
//  @access Private
const createCategory = asyncHandler(async (req, res) => {
    const nameFromReq = req.body.name;
    const category = await CategoryModel.create({
        name: nameFromReq,
        slag: slugify(nameFromReq)
    })
    res.status(201).json({
        status: 'success',
        data: category
    })
});


module.exports = {createCategory , getCategories, getCategoryById};