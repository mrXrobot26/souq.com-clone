const { default: slugify } = require("slugify");
const SubCategory = require("../../models/subCategoryModel");
const asyncHandler = require("express-async-handler");
const factoryHandler = require("../../utils/factoryHandler");
const APIFeatures = require("../../utils/APIFeatures");

const populateOptions = [{ path: "category", select: "name" }];

const getSpacificSubCategory = asyncHandler(
  async (subCategoryIdFromController) => {
    return await factoryHandler.getOne(
      SubCategory,
      "SubCategory",
      populateOptions
    )(subCategoryIdFromController);
  }
);

const getSpacificSubCategories = asyncHandler(
  async (req, categoryIdFromController = null) => {
    let baseQuery = SubCategory.find({ category: categoryIdFromController });
    const features = new APIFeatures(baseQuery, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["name"]);
    populateOptions.forEach((option) => {
      features.query.populate(option);
    });
    const subCategoriesFromDb = await features.query;
    const count = await SubCategory.countDocuments({
      category: categoryIdFromController,
    });
    return await features.formatResponse(subCategoriesFromDb, count);
  }
);

const createSubCategory = asyncHandler(
  async (nameFromController, categoryIdFromController) => {
    const subCategoryData = {
      name: nameFromController,
      slug: slugify(nameFromController),
      category: categoryIdFromController,
    };
    return await factoryHandler.createOne(
      SubCategory,
      populateOptions
    )(subCategoryData);
  }
);

const updateSubCategory = asyncHandler(
  async (idFromController, nameFromController, categoryIdFromController) => {
    const updateData = {
      name: nameFromController,
      slug: slugify(nameFromController),
      category: categoryIdFromController,
    };
    return await factoryHandler.updateOne(
      SubCategory,
      "SubCategory",
      populateOptions
    )(idFromController, updateData);
  }
);

const deleteSubCategory = asyncHandler(async (idFromController) => {
  return factoryHandler.deleteOne(SubCategory, "SubCategory")(idFromController);
});

module.exports = {
  getSpacificSubCategory,
  getSpacificSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
