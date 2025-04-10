const { param, body, query } = require("express-validator");
const { validate } = require("../../middlewares/validationMiddleware");

const validateSubCategoryId = [
  param("id").isMongoId().withMessage("Invalid SubCategory ID --EV"),
  validate,
];

const validateCategoryId = [
  param("categoryId").isMongoId().withMessage("Invalid Category ID --EV"),
  validate,
];
const validateCreateSubCategory = [
  body("name")
    .notEmpty()
    .withMessage("SubCategory name is required --EV")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("SubCategory name must be between 3 and 50 characters --EV"),
  param("categoryId").isMongoId().withMessage("Invalid Category ID --EV"),
  validate,
];

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

const validateUpdateSubCategory = [
  param("id").isMongoId().withMessage("Invalid SubCategory ID --EV"),
  body("name")
    .notEmpty()
    .withMessage("SubCategory name is required --EV")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("SubCategory name must be between 3 and 50 characters --EV"),
  body("categoryId").isMongoId().withMessage("Invalid Category ID --EV"),
  validate,
];

module.exports = {
  validateSubCategoryId,
  validateCategoryId,
  validateCreateSubCategory,
  validatePagination,
  validateUpdateSubCategory,
};
