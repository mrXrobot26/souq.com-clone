const Category = require("../../models/categoryModel");
const slugify = require("slugify");
const APIError = require("../../utils/APIError");
const asyncHandler = require("express-async-handler");

// Helper function to handle common errors
const handleErrors = (error) => {
  if (error instanceof APIError) {
    throw error;
  }
  throw new APIError(error.message, 500);
};

// Helper function to handle duplicate key errors
const handleDuplicateKeyError = (error) => {
  if (error.code === 11000) {
    throw new APIError("Category with this name already exists", 400);
  }
  handleErrors(error);
};

const getCategoryById = asyncHandler(async (id) => {
  const categoryFromDb = await Category.findById(id);
  if (!categoryFromDb) {
    throw new APIError("Category not found", 404);
  }

  return {
    data: categoryFromDb,
  };
});

const getCategories = asyncHandler(async (req) => {
  const APIFeatures = require("../../utils/APIFeatures");
  
  // Initialize APIFeatures with Category model and request query
  const features = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search(['name']);
  
  // Execute query
  const categoriesFromDb = await features.query;
  
  // Get total count for pagination
  const count = await Category.countDocuments(features.query.getFilter());
  
  // Return formatted response
  return features.formatResponse(categoriesFromDb, count);
});

const createCategory = asyncHandler(async (nameFromController) => {
  const categoryToDb = await Category.create({
    name: nameFromController,
    slug: slugify(nameFromController),
  });

  return {
    data: categoryToDb,
  };
});

const updateCategory = asyncHandler(async (idFromController, nameFromController) => {
  const categoryFromDb = await Category.findOneAndUpdate(
    { _id: idFromController },
    { name: nameFromController, slug: slugify(nameFromController) },
    { new: true, runValidators: true }
  );

  if (!categoryFromDb) {
    throw new APIError("Category not found", 404);
  }

  return {
    data: categoryFromDb,
  };
});

const deleteCategoryById = asyncHandler(async (idFromController) => {
  const categoryFromDb = await Category.findByIdAndDelete(idFromController);

  if (!categoryFromDb) {
    throw new APIError("Category not found", 404);
  }

  return {
    message: "Category deleted successfully",
  };
});

module.exports = {
  getCategoryById,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategoryById,
};
