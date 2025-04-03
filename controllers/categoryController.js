const {getCategoryById , getCategories , createCategory,updateCategory,deleteCategoryById} = require('../services/controllerServices/CategoryService')
const asyncHandler = require('express-async-handler')

// @desc   Get Category by id
// @route  GET /api/v1/categories/:id
// @access public
const getCategoryByIdController = asyncHandler (async(req,res) =>{
    const {id} = req.params
    const result = await getCategoryById(id)
    if(!result.success){
        return res.status(404).json({
            status: 'fail',
            message: result.message 
        })
    }
    res.status(200).json({
        status: 'success',
        data: result.data
    });
})

// @desc   Get All Categories
// @route  GET /api/v1/categories
// @access public
const getCategoriesController = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const result = await getCategories(page, limit);

    if (!result.success) {
        return res.status(400).json({
            status: 'fail',
            message: result.message
        });
    }

    res.status(200).json({
        status: 'success',
        results : result.results,
        data: result.data
    });
});


// @desc   Create a new Category
// @route  POST /api/v1/categories
// @access public
const createCategoryController = asyncHandler(async (req, res) => {
    const nameFromReq = req.body.name;
    const result = await createCategory(nameFromReq);

    if (!result.success) {
        return res.status(400).json({
            status: 'fail',
            message: result.message
        });
    }

    res.status(201).json({
        status: 'success',
        data: result.data
    });
});

// @desc   Update an existing category
// @route  PUT /api/v1/categories/:id
// @access Private
const updateCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const result = await updateCategory(id, name);

    if (!result.success) {
        return res.status(400).json({
            status: 'fail',
            message: result.message
        });
    }

    res.status(200).json({
        status: 'success',
        data: result.data
    });
});


const deleteCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await deleteCategoryById(id);

    if (!result.success) {
        return res.status(400).json({
            status: 'fail',
            message: result.message
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Category deleted successfully'
    });
});


module.exports= {
    getCategoryByIdController,
    getCategoriesController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController
}