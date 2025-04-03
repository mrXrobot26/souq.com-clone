const express = require('express')
const router = express.Router()
const {getCategoryByIdController,getCategoriesController
    ,createCategoryController,updateCategoryController,deleteCategoryController
} = require('../controllers/categoryController')

router.route('/:id').get(getCategoryByIdController).put(updateCategoryController).delete(deleteCategoryController)
router.route('/').get(getCategoriesController).post(createCategoryController)
module.exports = router;