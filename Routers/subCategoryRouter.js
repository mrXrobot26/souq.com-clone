const express = require("express");
const {
  getSpacificSubCategoryController,
  getSpacificSubCategoriesController,
  createSubCategoryController,
} = require("../controllers/subCategoryController");
const {
  validateSubCategoryId,
  validateCategoryId,
} = require("../utils/validator/subCategoryValidator");

const router = express.Router();

router.get("/:id", validateSubCategoryId, getSpacificSubCategoryController);
router.get(
  "/category/:categoryId",
  validateCategoryId,
  getSpacificSubCategoriesController
);

router.post("/", validateCreateSubCategory, createSubCategoryController);
module.exports = router;
