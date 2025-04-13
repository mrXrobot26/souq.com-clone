const { param, body, query } = require("express-validator");
const { validate } = require("../../middlewares/validationMiddleware");
const APIError = require("../APIError");
const Category = require("../../models/categoryModel");
const subCategory = require("../../models/subCategoryModel");
const Brand = require("../../models/brandModel");
// Validate MongoDB ID parameter
const validateProductId = [
  param("id").isMongoId().withMessage("Invalid Product ID format --EV"),
  validate,
];

// Validate product creation and update
const validateProduct = [
  // Title validation
  body("title")
    .notEmpty()
    .withMessage("Product title is required --EV")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters --EV")
    .trim(),

  // Description validation
  body("description")
    .notEmpty()
    .withMessage("Product description is required --EV")
    .isLength({ min: 30 })
    .withMessage("Description must be at least 30 characters --EV"),

  // Quantity validation
  body("quantity")
    .notEmpty()
    .withMessage("Product quantity is required --EV")
    .isNumeric()
    .withMessage("Quantity must be a number --EV"),

  // Sold validation (optional)
  body("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sold count must be a non-negative number --EV"),

  // Price validation
  body("price")
    .notEmpty()
    .withMessage("Product price is required --EV")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number --EV"),

  // Price after discount validation (optional)
  body("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discounted price must be a non-negative number --EV")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new APIError(
          "Discounted price must be lower than regular price --EV",
          400
        );
      }
      return true;
    }),

  // Colors validation (optional)
  body("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array --EV")
    .custom((value) => {
      if (!value.every((color) => typeof color === "string")) {
        throw new APIError("Each color must be a string --EV", 400);
      }
      return true;
    }),

  // Image cover validation
  body("imageCover")
    .notEmpty()
    .withMessage("Product cover image is required --EV"),

  // Images validation (optional)
  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array --EV"),

  // Category validation
  body("category")
    .notEmpty()
    .withMessage("Product category is required --EV")
    .isMongoId()
    .withMessage("Invalid category ID format --EV")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new APIError("Category not found with this ID --EV", 404);
      }
      return true;
    }),

  // Subcategory validation (optional)
  body("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID format --EV")
    .isArray()
    .withMessage("Subcategories must be an array --EV")
    .custom(async (subCategoryIds, { req }) => {
      for (const subCategoryId of subCategoryIds) {
        const subcategory = await subCategory.findById(subCategoryId);
        if (!subcategory) {
          throw new APIError("Subcategory not found with this ID --EV", 404);
        }
        if (subcategory.category.toString() !== req.body.category) {
          throw new APIError(
            "Subcategory does not belong to the specified category --EV",
            400
          );
        }
      }
      return true;
    }),
  // Note:
  // Inside .custom((value, { req }) => {...})
  // Express Validator passes two arguments to the callback:
  // 1. value:     The value being validated (e.g., subCategory)
  // 2. meta:      An object containing additional context:
  //    - req:      The Express request object
  //    - location: Where the value came from (body, query, etc.)
  //    - path:     The field name (e.g., "subCategory")
  // So when using ({ req }), we are destructuring the meta object to get req

  // Brand validation (optional)
  body("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID format --EV")
    .custom(async (brandId) => {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        throw new APIError("Brand not found with this ID --EV", 404);
      }
      return true;
    }),

  // Rating average validation (optional)
  body("ratingAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5 --EV"),

  // Rating quantity validation (optional)
  body("ratingQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Rating quantity must be a non-negative number --EV"),

  validate,
];

// Validate pagination parameters
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer --EV")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100 --EV")
    .toInt(),
  validate,
];

module.exports = {
  validateProductId,
  validateProduct,
  validatePagination,
};
