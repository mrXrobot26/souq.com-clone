const AsyncHandler = require("express-async-handler");
const APIResponse = require("../utils/APIResponse");
const {
  getSpacificSubCategory,
  getSpacificSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../services/controllerServices/subCategoryService");

const getSpacificSubCategoryController = AsyncHandler(async (req, res) => {
  const { id } = req.params; // Changed from subCategoryId to id to match route parameter
  const result = await getSpacificSubCategory(id);
  APIResponse.send(res, APIResponse.success(result));
});

const getSpacificSubCategoriesController = AsyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const result = await getSpacificSubCategories(req, categoryId);
  const responseData = {
    results: result.results,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    data: result.data,
  };
  APIResponse.send(res, APIResponse.success(responseData));
});

const createSubCategoryController = AsyncHandler(async (req, res) => {
  const name = req.body.name;
  const { categoryId } = req.params;

  const result = await createSubCategory(name, categoryId);
  APIResponse.send(
    res,
    APIResponse.success(result.data, 201, "SubCategory created successfully")
  );
});

const updateSubCategoryController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, categoryId } = req.body;

  const result = await updateSubCategory(id, name, categoryId);
  APIResponse.send(
    res,
    APIResponse.success(result.data, 200, "SubCategory updated successfully")
  );
});

const deleteSubCategoryController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteSubCategory(id);
  return APIResponse.send(
    res,
    APIResponse.success(null, 200, "SubCategory deleted successfully")
  );
});

module.exports = {
  getSpacificSubCategoryController,
  getSpacificSubCategoriesController,
  createSubCategoryController,
  updateSubCategoryController,
  deleteSubCategoryController,
};
