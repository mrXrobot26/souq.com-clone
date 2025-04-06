const express = require("express");
const {
  getSpacificSubCategoryController,
} = require("../controllers/subCategoryController");

const {validateMongoId} = require('../utils/validator/subCategoryValidator')
const router = express.Router();

router.get("/:id",validateMongoId , getSpacificSubCategoryController);

module.exports = router