const Category = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler')




//  @desc   Get Category by id
//  @route  GET /api/v1/categories/id
//  @access public
const getCategoryById = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const category = await Category.findById(id);
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
    const categories = await Category.find({}).skip(skip).limit(limit)
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
    const category = await Category.create({
        name: nameFromReq,
        slag: slugify(nameFromReq)
    })
    res.status(201).json({
        status: 'success',
        data: category
    })
});

//  @desc   Update an existing category
//  @route  PUT /api/v1/categories/:id
//  @access Private
const updateCategory = asyncHandler(async(req, res) => {
    const {id} = req.params;
    const nameFromReq = req.body.name
    const category = await Category.findOneAndUpdate({_id : id},{name : nameFromReq , slag : slugify(nameFromReq)},{new : true})
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

module.exports = {createCategory , getCategories, getCategoryById , updateCategory};