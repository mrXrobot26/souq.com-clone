const { param } = require("express-validator");
const { validate } = require("../../middlewares/validationMiddleware");

const validateSubCategoryId = [
  param("id").isMongoId().withMessage("Invalid SubCategory ID --EV"),
  validate,
];

const validateCategoryId = [
  param("categoryId").isMongoId().withMessage("Invalid Category ID --EV"),
  validate,
];

module.exports = {
  validateSubCategoryId,
  validateCategoryId
};
