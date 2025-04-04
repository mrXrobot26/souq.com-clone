const globalError = (err, req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        statusCode : err.statusCode,
        status: err.status,
        message: err.message,
        stack: err.stack 
    });
}

module.exports = globalError