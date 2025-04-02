const express = require('express')
const router = express.Router()
const {createCategory , getCategories, getCategoryById , updateCategory, deleteCategoryById} = require('../services/CategoryService')

router.route('/').get(getCategories).post(createCategory)
router.route('/:id').get(getCategoryById).put(updateCategory).delete(deleteCategoryById)
module.exports = router;