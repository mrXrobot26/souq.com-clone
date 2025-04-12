const { param, body, query } = require("express-validator");
const { validate } = require("../../middlewares/validationMiddleware");

// Validate MongoDB ID parameter
const validateProductId = [
  param("id").isMongoId().withMessage("Invalid Product ID format --EV"),
  validate,
];

// Validate product creation and update
const validateProduct = [
  body("title")
    .notEmpty()
    .withMessage("Product title is required --EV")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters --EV")
    .trim(),
  body("description")
    .notEmpty()
    .withMessage("Product description is required --EV")
    .isLength({ min: 30 })
    .withMessage("Description must be at least 30 characters --EV"),
  body("quantity")
    .notEmpty()
    .withMessage("Product quantity is required --EV")
    .isNumeric()
    .withMessage("Quantity must be a number --EV"),
  body("price")
    .notEmpty()
    .withMessage("Product price is required --EV")
    .isNumeric()
    .withMessage("Price must be a number --EV"),
  body("category")
    .notEmpty()
    .withMessage("Product category is required --EV")
    .isMongoId()
    .withMessage("Invalid category ID format --EV"),
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
