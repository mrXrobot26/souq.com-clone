const express = require("express");
const {
  getSpacificSubCategoryController,
  getSpacificSubCategoriesController,
  createSubCategoryController,
  updateSubCategoryController,
  deleteSubCategoryController,
} = require("../controllers/subCategoryController");
const {
  validateSubCategoryId,
  validateCategoryId,
  validateCreateSubCategory,
  validatePagination,
  validateUpdateSubCategory,
} = require("../utils/validator/subCategoryValidator");

const router = express.Router();

// @desc   Get SubCategory by id
// @route  GET /api/v1/subcategories/:id
// @access public
router.get(
  "/:id",
  [...validateSubCategoryId, ...validatePagination],
  getSpacificSubCategoryController
);

// @desc   Get SubCategories by category id
// @route  GET /api/v1/subcategories/category/:categoryId
// @access public
router.get(
  "/category/:categoryId",
  validateCategoryId,
  getSpacificSubCategoriesController
);

// @desc   Create a new SubCategory
// @route  POST /api/v1/subcategories
// @access private
router.post("/", [validateCreateSubCategory], createSubCategoryController);

// @desc   Update an existing SubCategory
// @route  PUT /api/v1/subcategories/:id
// @access private
router.put("/:id", [validateUpdateSubCategory], updateSubCategoryController);

// @desc   Delete SubCategory by id
// @route  DELETE /api/v1/subcategories/:id
// @access private
router.delete("/:id", validateSubCategoryId, deleteSubCategoryController);


module.exports = router;
