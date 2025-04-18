const express = require("express");
const subcategoriesRoute = require("./subCategoryRouter");
const {
  validateMongoId,
  validateCategory,
  validatePagination,
} = require("../utils/validator/categoryValidator");
const router = express.Router();
const {
  getCategoryByIdController,
  getCategoriesController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/categoryController");

router.use("/:categoryId/subcategories", subcategoriesRoute);

// Get category by ID
router.get("/:id", validateMongoId, getCategoryByIdController);

// Update category
router.put(
  "/:id",
  [...validateMongoId, ...validateCategory],
  updateCategoryController
);

// Delete category
router.delete("/:id", validateMongoId, deleteCategoryController);

// Get all categories
router.get("/", validatePagination, getCategoriesController);

// Create new category
router.post("/", validateCategory, createCategoryController);

// Note: If we're passing multiple middleware arrays (e.g. validateMongoId, validateCategory),
// we must use the spread operator [...arr1, ...arr2] to flatten them into a single array.
// Express only auto-flattens a single array of middleware. => validateMongoId

module.exports = router;
