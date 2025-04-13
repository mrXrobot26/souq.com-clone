const { validationResult } = require('express-validator');
const APIError = require('../utils/APIError')
// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return next(new APIError(errorMessages.join(', '), 400));
    }
    next();
};


// validate
// validate middleware → checks for any validation errors before hitting the controller
// if any errors are found, it sends a 400 response with all messages

module.exports = {
    validate
}
