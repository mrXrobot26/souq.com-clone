const { default: slugify } = require("slugify");
const subCategory = require("../../models/subCategoryModel");
const APIError = require("../../utils/APIError");
const asyncHandler = require("express-async-handler");


const getSpacificSubCategory = asyncHandler(async (subCategoryIdFromController) => {
  const subCategoryFromDb = await subCategory
    .findById(subCategoryIdFromController)
    .populate({ path: "category", select: "name" });
  if (!subCategoryFromDb) {
    throw new APIError("SubCategory not found", 404);
  }
  return {
    data: subCategoryFromDb,
  };
});

const getSpacificSubCategories = asyncHandler(async (
  req,
  categoryIdFromController = null
) => {
  const APIFeatures = require("../../utils/APIFeatures");
  
  // Set base filter if category ID is provided
  let baseQuery = subCategory.find();
  if (categoryIdFromController) {
    baseQuery = subCategory.find({ category: categoryIdFromController });
  }
  
  // Initialize APIFeatures with subCategory model and request query
  const features = new APIFeatures(baseQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search(['name']);
  
  // Add populate options
  features.query.populate({ path: "category", select: "name" });
  
  // Execute query
  const subCategoriesFromDb = await features.query;
  
  // Get total count for pagination
  const count = await subCategory.countDocuments(features.query.getFilter());
  
  // Return formatted response
  return features.formatResponse(subCategoriesFromDb, count);
});

const createSubCategory = asyncHandler(async (
  nameFromController,
  categoryIdFromController
) => {
  const subCategoriesToDb = await subCategory.create({
    name: nameFromController,
    slug: slugify(nameFromController),
    category: categoryIdFromController,
  });

  const populatedSubCategory = await subCategory
    .findById(subCategoriesToDb._id)
    .populate("category");

  return {
    data: populatedSubCategory,
  };
});

const updateSubCategory = asyncHandler(async (
  idFromController,
  nameFromController,
  categoryIdFromController
) => {
  const subCategoryFromDb = await subCategory
    .findOneAndUpdate(
      { _id: idFromController },
      {
        name: nameFromController,
        slug: slugify(nameFromController),
        category: categoryIdFromController,
      },
      { new: true, runValidators: true }
    )
    .populate("category");

  if (!subCategoryFromDb) {
    throw new APIError("SubCategory not found", 404);
  }

  return {
    data: subCategoryFromDb,
  };
});

const deleteSubCategory = asyncHandler(async (idFromController) => {
  const subCategoryFromDb =
    await subCategory.findByIdAndDelete(idFromController);

  if (!subCategoryFromDb) {
    throw new APIError("SubCategory not found", 404);
  }

  return {
    message: "SubCategory deleted successfully",
  };
});

module.exports = {
  getSpacificSubCategory,
  getSpacificSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
