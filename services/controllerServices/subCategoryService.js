const subCategory = require("../../models/subCategoryModel");
const APIError = require("../../utils/APIError");

const getSpacificSubCategory = async (subCategoryIdFromController) => {
  try {
    const subCategoryFromDb = await subCategory
      .findById(subCategoryIdFromController)
      .populate("category");
    if (!subCategoryFromDb) {
      throw new APIError("SubCategory not found", 404);
    }
    return {
      success: true,
      data: subCategoryFromDb,
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error.message || "An error occurred while fetching the subcategory",
      500
    );
  }
};

const getSpacificSubCategories = async (
  page = 1,
  limit = 10,
  categoryIdFromController = null
) => {
  try {
    const skip = (page - 1) * limit;
    /**
     * why i use filter not direct categoryID
     * Flexibility:
      The filter object allows you to build dynamic queries
      You can easily add more filter conditions without changing the query structure
      Conditional Filtering:

      In your code, the filter is only applied when categoryID exists
      ---- If categoryID is undefined/null, an empty filter {} returns all subcategories
     */
    let filter = {};

    if (categoryIdFromController) {
      filter.category = categoryIdFromController;
    }
    const count = await subCategory.countDocuments(filter);
    const subCategoriesFromDb = await subCategory
      .find(filter)
      .populate("category")
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      results: subCategoriesFromDb.length,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: subCategoriesFromDb,
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error.message || "An error occurred while fetching the subcategory",
      500
    );
  }
};

module.exports = {
  getSpacificSubCategory,
  getSpacificSubCategories,
};
