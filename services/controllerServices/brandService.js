const { default: slugify } = require("slugify");
const Brand = require("../../models/brandModel");
const APIError = require("../../utils/APIError");
const asyncHandler = require("express-async-handler");


/**
 * Creates a new brand
 * @param {string} nameFromController - The name of the brand to create
 * @returns {Object} - Object containing the created brand
 */
const createBrand = asyncHandler(async (nameFromController) => {
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
  const APIFeatures = require("../../utils/APIFeatures");
  
  // Initialize APIFeatures with Brand model and request query
  const features = new APIFeatures(Brand.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search(['name']);

  
  // Execute query
  const brandsFromDb = await features.query;
  
  // Get total count for pagination
  const count = await Brand.countDocuments(features.query.getFilter());
  
  // Return formatted response with pagination metadata
  return features.formatResponse(brandsFromDb, count);
});

/**
 * Updates a brand by ID
 * @param {string} idFromController - The ID of the brand to update
 * @param {string} nameFromController - The new name for the brand
 * @returns {Object} - Object containing the updated brand
 */
const updateBrand = asyncHandler(async (idFromController, nameFromController) => {
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
