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
    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        status: err.status,
        message: err.message,
        stack: err.stack
    });
};

const globalErrorOnProd = (err, res) => {
    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        message: err.message
    });
};

module.exports = globalError;