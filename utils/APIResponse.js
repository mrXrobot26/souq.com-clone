/**
 * APIResponse class for standardizing API responses following JSend specification
 * https://github.com/omniti-labs/jsend
 */
class APIResponse {
  /**
   * Creates a success response object
   * @param {any} data - The data to be returned
   * @param {number} statusCode - HTTP status code (default: 200)
   * @param {string} message - Optional success message
   * @returns {Object} JSend formatted success response
   */
  static success(data, statusCode = 200, message = null) {
    const response = {
      status: "success",
      data,
    };

    if (message) {
      response.message = message;
    }

    return {
      statusCode,
      body: response,
    };
  }

  /**
   * Creates a fail response object (client error)
   * @param {string|Object} data - Error details or validation errors
   * @param {number} statusCode - HTTP status code (default: 400)
   * @returns {Object} JSend formatted fail response
   */
  static fail(data, statusCode = 400) {
    return {
      statusCode,
      body: {
        status: "fail",
        data: typeof data === "string" ? { message: data } : data,
      },
    };
  }

  /**
   * Creates an error response object (server error)
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {Object} data - Optional additional error data
   * @returns {Object} JSend formatted error response
   */
  static error(message, statusCode = 500, data = null) {
    const response = {
      status: "error",
      message,
    };

    if (data) {
      response.data = data;
    }

    return {
      statusCode,
      body: response,
    };
  }

  /**
   * Sends the response to the client
   * @param {Object} res - Express response object
   * @param {Object} responseObj - Response object from success/fail/error methods
   */
  static send(res, responseObj) {
    return res.status(responseObj.statusCode).json(responseObj.body);
  }
}

module.exports = APIResponse;
