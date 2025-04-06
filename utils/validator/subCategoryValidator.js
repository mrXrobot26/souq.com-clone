const { param, body, query } = require("express-validator");
const { validate } = require("../../middlewares/validationMiddleware");

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format --EV"),
  validate,
];


module.exports = {
    validateMongoId,
}
