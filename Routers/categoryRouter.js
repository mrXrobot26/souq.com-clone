const express = require('express')
const router = express.Router()
const {createCategory , getCategories, getCategoryById , updateCategory} = require('../services/CategoryService')

// router.post('/',createCategory)
// router.get('/',getCategories ) = ↓↓↓↓↓↓
router.route('/').get(getCategories).post(createCategory)
router.route('/:id').get(getCategoryById).put(updateCategory)
module.exports = router;