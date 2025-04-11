const { param, body, query } = require('express-validator');
const { validate } = require('../../middlewares/validationMiddleware');

// Validate MongoDB ID parameter
const validateBrandId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid Brand ID format --EV'),
    validate
];

// Validate brand creation and update
const validateBrand = [
    body('name')
        .notEmpty()
        .withMessage('Brand name is required --EV')
        .isLength({ min: 3, max: 32 })
        .withMessage('Brand name must be between 3 and 32 characters --EV')
        .trim(),
    validate
];

// Validate pagination parameters
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer --EV')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100 --EV')
        .toInt(),
    validate
];

module.exports = {
    validateBrandId,
    validateBrand,
    validatePagination
};