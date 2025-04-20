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

const {
  uploadCategoryImage,
  processCategoryImage,
} = require("../services/controllerServices/CategoryService");

router.use("/:categoryId/subcategories", subcategoriesRoute);

router.get("/:id", validateMongoId, getCategoryByIdController);

router.put(
  "/:id",
  uploadCategoryImage,
  processCategoryImage,
  [...validateMongoId, ...validateCategory],
  updateCategoryController
);

router.delete("/:id", validateMongoId, deleteCategoryController);

router.get("/", validatePagination, getCategoriesController);

router.post(
  "/",
  uploadCategoryImage,
  processCategoryImage,
  validateCategory,
  createCategoryController
);

// Note: If we're passing multiple middleware arrays (e.g. validateMongoId, validateCategory),
// we must use the spread operator [...arr1, ...arr2] to flatten them into a single array.
// Express only auto-flattens a single array of middleware. => validateMongoId

module.exports = router;
