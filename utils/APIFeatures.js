/**
 * APIFeatures Class
 * Handles MongoDB query operations like filtering, sorting, field limiting, pagination, and searching
 */
class APIFeatures {
  /**
   * @param {Object} mongooseQuery - Mongoose query object
   * @param {Object} queryString - Express request.query object
   */
  constructor(mongooseQuery, queryString) {
    this.query = mongooseQuery;
    this.queryString = queryString;
  }

  /**
   * Filters query based on MongoDB operators (gte, gt, lte, lt, etc.)
   * @returns {APIFeatures} - Returns this for method chaining
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    
    // Remove excluded fields from query object
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Parse query parameters and handle operators like [gte], [gt], [lte], [lt]
    const parsedQuery = {};
    Object.keys(queryObj).forEach(key => {
      if (key.includes('[') && key.includes(']')) {
        const fieldName = key.split('[')[0];
        const operator = key.split('[')[1].split(']')[0];
        
        if (!parsedQuery[fieldName]) {
          parsedQuery[fieldName] = {};
        }
        
        parsedQuery[fieldName][`$${operator}`] = queryObj[key];
      } else {
        parsedQuery[key] = queryObj[key];
      }
    });
    
    this.query = this.query.find(parsedQuery);
    
    return this;
  }

  /**
   * Sorts results based on sort parameter
   * @returns {APIFeatures} - Returns this for method chaining
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort by creation date (newest first)
      this.query = this.query.sort('-createdAt');
    }
    
    return this;
  }

  /**
   * Limits the fields returned in the response
   * @returns {APIFeatures} - Returns this for method chaining
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    else{
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /**
   * Implements pagination
   * @returns {APIFeatures} - Returns this for method chaining
   */
  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;
    
    this.query = this.query.skip(skip).limit(limit);
    this.paginationData = { page, limit, skip };
    
    return this;
  }

  /**
   * Implements keyword search
   * @param {Array} fields - Fields to search in
   * @returns {APIFeatures} - Returns this for method chaining
   */
  search(fields = ['title', 'description']) {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword;
      
      const searchQuery = {
        $or: fields.map(field => ({
          [field]: { $regex: keyword, $options: 'i' }
        }))
      };
      
      this.query = this.query.find(searchQuery);
    }
    
    return this;
  }

  /**
   * Get pagination metadata for formatting response
   * @param {number} totalCount - Total count of documents
   * @returns {Object} - Formatted pagination metadata
   */
  getPaginationMeta(totalCount) {
    const { page, limit } = this.paginationData;
    
    return {
      results: null, // Will be set after query execution
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit
    };
  }

  /**
   * Format final response with pagination metadata
   * @param {Array} data - Query results
   * @param {number} totalCount - Total count of documents
   * @returns {Object} - Formatted response with pagination metadata
   */
  formatResponse(data, totalCount) {
    const meta = this.getPaginationMeta(totalCount);
    meta.results = data.length;
    
    return {
      ...meta,
      data
    };
  }
}

module.exports = APIFeatures; 