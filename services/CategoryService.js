const CategoryModel = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler')
const AddCategory = asyncHandler(async (req, res) => {
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
module.exports = AddCategory;

