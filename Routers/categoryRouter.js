const express = require('express')
const router = express.Router()
const {createCategory , getCategories} = require('../services/CategoryService')

// router.post('/',createCategory)
// router.get('/',getCategories ) = ↓↓↓↓↓↓
router.route('/').get(getCategories).post(createCategory)

module.exports = router;