const express = require('express')
const router = express.Router()
const AddCategory = require('../services/CategoryService')

router.post('/',AddCategory)


module.exports = router;