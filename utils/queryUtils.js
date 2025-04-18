/**
 * Utility functions for handling MongoDB query operations
 * This module provides reusable functions for filtering, pagination, and other query operations
 */

/**
 * Parses query string parameters and transforms them into MongoDB query operators
 * Handles special syntax like price[gte]=100 to {price: {$gte: 100}}
 *
 * @param {Object} queryParams - The query parameters from req.query
 * @param {Array} excludeFields - Fields to exclude from filtering (e.g., 'page', 'limit')
 * @returns {Object} - MongoDB compatible query object
 */
const parseQueryParamsToMatchMongooStructure = (
  queryParams,
  excludeFields = []
) => {
  // Create a copy of the query parameters
  const queryStringObj = { ...queryParams };

  // Remove excluded fields from the query
  excludeFields.forEach((field) => delete queryStringObj[field]);

  // Parse and transform query parameters with operators
  const parsedQuery = {};

  Object.keys(queryStringObj).forEach((key) => {
    if (key.includes("[") && key.includes("]")) {
      // Extract field name and operator from the key
      const fieldName = key.split("[")[0];
      const operator = key.split("[")[1].split("]")[0];

      // Initialize nested object for the field if it doesn't exist
      if (!parsedQuery[fieldName]) {
        parsedQuery[fieldName] = {};
      }

      // Add MongoDB operator with its value
      parsedQuery[fieldName][`$${operator}`] = queryStringObj[key];
    } else {
      // For regular fields without operators
      parsedQuery[key] = queryStringObj[key];
    }
  });

  return parsedQuery;
};

/**
 * Handles pagination for MongoDB queries
 *
 * @param {Object} queryParams - The query parameters from req.query
 * @param {number} defaultPage - Default page number if not specified
 * @param {number} defaultLimit - Default limit of items per page if not specified
 * @returns {Object} - Pagination parameters {page, limit, skip}
 */
const getPaginationParams = (
  queryParams,
  defaultPage = 1,
  defaultLimit = 10
) => {
  const page = parseInt(queryParams.page) || defaultPage;
  const limit = parseInt(queryParams.limit) || defaultLimit;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Creates a formatted response object with pagination metadata
 *
 * @param {Array} data - The data to be returned
 * @param {number} count - Total count of documents matching the query
 * @param {Object} paginationParams - Pagination parameters from getPaginationParams()
 * @returns {Object} - Formatted response with pagination metadata
 */
const formatPaginatedResponse = (data, count, paginationParams) => {
  const { page, limit } = paginationParams;

  return {
    results: data.length,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: data,
  };
};

module.exports = {
  parseQueryParamsToMatchMongooStructure,
  getPaginationParams,
  formatPaginatedResponse,
};
