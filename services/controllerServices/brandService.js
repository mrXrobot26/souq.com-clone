const { default: slugify } = require("slugify");
const Brand = require("../../models/brandModel");
const APIError = require("../../utils/APIError");

/**
 * Wrapper function to handle common error patterns in service methods
 * @param {Function} fn - The service function to wrap
 * @returns {Function} - Wrapped function with standardized error handling
 */
const asyncHandler = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    if (error.code === 11000) {
      throw new APIError("Brand with this name already exists", 400);
    }
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message, 500);
  }
};

/**
 * Validates a brand name according to business rules
 * @param {string} name - The brand name to validate
 * @throws {APIError} - If validation fails
 */
const validateBrandName = (name) => {
  if (!name) {
    throw new APIError("Brand name is required", 400);
  }
  
  if (typeof name !== 'string') {
    throw new APIError("Brand name must be a string", 400);
  }
  
  // These checks are redundant with mongoose validation, but provide better error messages
  if (name.length < 3) {
    throw new APIError("Brand name must be at least 3 characters", 400);
  }
  
  if (name.length > 32) {
    throw new APIError("Brand name cannot exceed 32 characters", 400);
  }
};

/**
 * Creates a new brand
 * @param {string} nameFromController - The name of the brand to create
 * @returns {Object} - Object containing the created brand
 */
const createBrand = asyncHandler(async (nameFromController) => {
  validateBrandName(nameFromController);

  const brandToDb = await Brand.create({
    name: nameFromController,
    slug: slugify(nameFromController, { lower: true, strict: true }),
  });

  return {
    data: brandToDb,
  };
});

/**
 * Gets a brand by ID
 * @param {string} idFromController - The ID of the brand to fetch
 * @returns {Object} - Object containing the brand data
 */
const getBrand = asyncHandler(async (idFromController) => {
  if (!idFromController) {
    throw new APIError("Brand Id is required", 400);
  }

  const brandFromDb = await Brand.findById(idFromController);

  if (!brandFromDb) {
    throw new APIError("Brand not found", 404);
  }

  return {
    data: brandFromDb,
  };
});

/**
 * Gets a paginated list of brands with optional filtering
 * @param {Object} req - Express request object containing query parameters
 * @returns {Object} - Paginated results with metadata
 */
const getBrands = asyncHandler(async (req) => {
  // Build query based on request parameters
  const queryObj = {};
  
  // Add name search if provided
  if (req.query.name) {
    queryObj.name = { $regex: req.query.name, $options: 'i' };
  }
  
  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Sorting
  const sortBy = req.query.sort || 'createdAt';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder;
  
  // Execute query with pagination and optional filters
  const countPromise = Brand.countDocuments(queryObj);
  const brandsPromise = Brand.find(queryObj)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
  
  // Wait for both promises to resolve
  const [count, brandsFromDb] = await Promise.all([countPromise, brandsPromise]);

  return {
    results: brandsFromDb.length,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: brandsFromDb,
  };
});

/**
 * Updates a brand by ID
 * @param {string} idFromController - The ID of the brand to update
 * @param {string} nameFromController - The new name for the brand
 * @returns {Object} - Object containing the updated brand
 */
const updateBrand = asyncHandler(async (idFromController, nameFromController) => {
  if (!idFromController) {
    throw new APIError("Brand Id is required", 400);
  }
  
  validateBrandName(nameFromController);

  const brand = await Brand.findOneAndUpdate(
    { _id: idFromController },
    { 
      name: nameFromController, 
      slug: slugify(nameFromController, { lower: true, strict: true }) 
    },
    { new: true, runValidators: true }
  );

  if (!brand) {
    throw new APIError("Brand not found", 404);
  }

  return {
    data: brand,
  };
});

/**
 * Deletes a brand by ID
 * @param {string} idFromController - The ID of the brand to delete
 * @returns {Object} - Success message
 */
const deleteBrand = asyncHandler(async (idFromController) => {
  if (!idFromController) {
    throw new APIError("Brand Id is required", 400);
  }

  const brand = await Brand.findByIdAndDelete(idFromController);

  if (!brand) {
    throw new APIError("Brand not found", 404);
  }

  return {
    message: "Brand deleted successfully",
  };
});

module.exports = {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
};
