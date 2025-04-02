const express = require('express')
const router = express.Router()
const {createCategory , getCategories, getCategoryById} = require('../services/CategoryService')

// router.post('/',createCategory)
// router.get('/',getCategories ) = ↓↓↓↓↓↓
router.route('/').get(getCategories).post(createCategory)
router.route('/:id').get(getCategoryById)
module.exports = router;