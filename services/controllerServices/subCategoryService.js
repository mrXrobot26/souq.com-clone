const { default: slugify } = require("slugify");
const subCategory = require("../../models/subCategoryModel");
const APIError = require("../../utils/APIError");

const getSpacificSubCategory = async (subCategoryIdFromController) => {
  try {
    const subCategoryFromDb = await subCategory
      .findById(subCategoryIdFromController)
      .populate({ path: "category", select: "name" });
    if (!subCategoryFromDb) {
      throw new APIError("SubCategory not found", 404);
    }
    return {
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
  req,
  categoryIdFromController = null
) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
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
      .populate({ path: "category", select: "name" })
      .skip(skip)
      .limit(limit);

    return {
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

const createSubCategory = async (
  nameFromController,
  categoryIdFromController
) => {
  try {
    if (!nameFromController) {
      throw new APIError("Name is required to create a subcategory", 400);
    }
    if (!categoryIdFromController) {
      throw new APIError(
        "Category ID is required to create a subcategory",
        400
      );
    }

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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error.message || "An error occurred while creating the subcategory",
      500
    );
  }
};

const updateSubCategory = async (
  idFromController,
  nameFromController,
  categoryIdFromController
) => {
  try {
    if (!nameFromController) {
      throw new APIError("SubCategory name is required", 400);
    }

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
  } catch (error) {
    if (error.code === 11000) {
      throw new APIError("SubCategory with this name already exists", 400);
    }
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error.message || "An error occurred while updating the subcategory",
      500
    );
  }
};

const deleteSubCategory = async (idFromController) => {
  try {
    const subCategoryFromDb =
      await subCategory.findByIdAndDelete(idFromController);

    if (!subCategoryFromDb) {
      throw new APIError("SubCategory not found", 404);
    }

    return {
      message: "SubCategory deleted successfully",
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error.message || "An error occurred while deleting the subcategory",
      500
    );
  }
};

module.exports = {
  getSpacificSubCategory,
  getSpacificSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
