const AsyncHandler = require("express-async-handler");
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
  return res.status(200).json({
    status: "success",
    data: result.data,
  });
});

const getSpacificSubCategoriesController = AsyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await getSpacificSubCategories(page, limit, categoryId);

  res.status(200).json({
    status: "success",
    results: result.results,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    data: result.data,
  });
});

const createSubCategoryController = AsyncHandler(async (req, res) => {
  const name = req.body.name;
  const categoryId = req.body.categoryId;

  const result = await createSubCategory(name, categoryId);
  return res.status(201).json({
    status: "success",
    data: result.data,
  });
});

const updateSubCategoryController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, categoryId } = req.body;

  const result = await updateSubCategory(id, name, categoryId);
  return res.status(200).json({
    status: "success",
    data: result.data,
  });
});

const deleteSubCategoryController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteSubCategory(id);

  return res.status(200).json({
    status: "success",
    message: "SubCategory deleted successfully",
  });
});


module.exports = {
  getSpacificSubCategoryController,
  getSpacificSubCategoriesController,
  createSubCategoryController,
  updateSubCategoryController,
  deleteSubCategoryController,
};
