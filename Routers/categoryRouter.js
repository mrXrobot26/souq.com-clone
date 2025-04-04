const express = require('express');
const router = express.Router();
const {
    getCategoryByIdController,
    getCategoriesController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController
} = require('../controllers/categoryController');


// Get, update, and delete specific category by ID
router.route('/:id')
    .get(getCategoryByIdController)
    .put(updateCategoryController)
    .delete(deleteCategoryController);

// Get all categories & Create new category
router.route('/')
    .get(getCategoriesController)
    .post(createCategoryController);


module.exports = router;