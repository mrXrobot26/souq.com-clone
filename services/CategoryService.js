const CategoryModel = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler')

//  @desc   Get All Categories
//  @route  GET /api/v1/categories
//  @access public
const getCategories = asyncHandler(async (req , res)=>{
    const categories = await CategoryModel.find({})
    res.status(201).json({
        status: 'success',
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


module.exports = {createCategory , getCategories};