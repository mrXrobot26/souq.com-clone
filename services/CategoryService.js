const CategoryModel = require('../models/categoryModel');
const slugify = require('slugify');

const AddCategory = async (req, res) => {
    const nameFromReq = req.body.name;
    await CategoryModel.create({
        name: nameFromReq,
        slag: slugify(nameFromReq)
    })
    .then( category => res.status(201).json({
        status: 'success',
        data: category
    }))
    .catch(err => res.status(500).json({
        status: 'error',
        message: err.message,
        code: err.code
    }))
};
module.exports = AddCategory;