const subCategory = require("../../models/subCategory")
const APIError = require("../../utils/APIError");

const getSpacificSubCategory = async (id) => {
  try {
    const subCategoryFromDb = await subCategory
      .findById(id)
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

module.exports = {
  getSpacificSubCategory,
};
