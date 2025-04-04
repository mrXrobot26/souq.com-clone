class APIError extends Error {

    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith('4') ? "Fail" : "Error";
        this.isOperational = true;
    }

}


module.exports = APIError