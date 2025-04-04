const { 
    getCategoryById, 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategoryById 
} = require('../services/controllerServices/CategoryService');
const asyncHandler = require('express-async-handler');

// @desc   Get Category by id
// @route  GET /api/v1/categories/:id
// @access public
const getCategoryByIdController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await getCategoryById(id);
    
    res.status(200).json({
        status: 'success',
        data: category
    });
});

// @desc   Get All Categories
// @route  GET /api/v1/categories
// @access public
const getCategoriesController = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const result = await getCategories(page, limit);

    res.status(200).json({
        status: 'success',
        results: result.results,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        data: result.data
    });
});

// @desc   Create a new Category
// @route  POST /api/v1/categories
// @access public
const createCategoryController = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await createCategory(name);

    res.status(201).json({
        status: 'success',
        data: category
    });
});

// @desc   Update an existing category
// @route  PUT /api/v1/categories/:id
// @access Private
const updateCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await updateCategory(id, name);

    res.status(200).json({
        status: 'success',
        data: category
    });
});

// @desc   Delete Category by id
// @route  DELETE /api/v1/categories/:id
// @access Private
const deleteCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteCategoryById(id);

    res.status(200).json({
        status: 'success',
        message: 'Category deleted successfully'
    });
});

module.exports = {
    getCategoryByIdController,
    getCategoriesController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController
};