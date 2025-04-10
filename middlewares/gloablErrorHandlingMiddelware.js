const APIResponse = require('../utils/APIResponse');

const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return globalErrorOnDev(err, res);
    } else {
        return globalErrorOnProd(err, res);
    }
};

const globalErrorOnDev = (err, res) => {
    if (err.status === 'Fail') {
        return APIResponse.send(res, APIResponse.fail({ message: err.message }, err.statusCode));
    } else {
        return APIResponse.send(res, APIResponse.error(err.message, err.statusCode, {
            error: err,
            stack: err.stack
        }));
    }
};

const globalErrorOnProd = (err, res) => {
    if (err.isOperational) {
        if (err.status === 'Fail') {
            return APIResponse.send(res, APIResponse.fail({ message: err.message }, err.statusCode));
        } else {
            return APIResponse.send(res, APIResponse.error(err.message, err.statusCode));
        }
    } else {
        console.error('ERROR 💥', err);
        return APIResponse.send(res, APIResponse.error('Something went wrong', 500));
    }
};

module.exports = globalError;