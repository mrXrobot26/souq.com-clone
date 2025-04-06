const { param, body } = require("express-validator");
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
  body("categoryId").isMongoId().withMessage("Invalid Category ID --EV"),
  validate,
];

module.exports = {
  validateSubCategoryId,
  validateCategoryId,
  validateCreateSubCategory,
};
