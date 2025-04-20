const asyncHandler = require("express-async-handler");
const APIResponse = require("../utils/APIResponse");
const {
  getCategoryById,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategoryById,
} = require("../services/controllerServices/CategoryService");

// @desc   Get Category by id
// @route  GET /api/v1/categories/:id
// @access public
const getCategoryByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await getCategoryById(id);

  APIResponse.send(res, APIResponse.success(category));
});

// @desc   Get All Categories
// @route  GET /api/v1/categories
// @access public
const getCategoriesController = asyncHandler(async (req, res) => {
  const result = await getCategories(req);

  const responseData = {
    results: result.results,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    data: result.data,
  };

  APIResponse.send(res, APIResponse.success(responseData));
});

// @desc   Create a new Category
// @route  POST /api/v1/categories
// @access public
const createCategoryController = asyncHandler(async (req, res) => {
  const category = await createCategory(req.body);

  APIResponse.send(
    res,
    APIResponse.success(category, 201, "Category created successfully")
  );
});

// @desc   Update an existing category
// @route  PUT /api/v1/categories/:id
// @access Private
const updateCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await updateCategory(id, req.body);

  APIResponse.send(
    res,
    APIResponse.success(category, 200, "Category updated successfully")
  );
});

// @desc   Delete Category by id
// @route  DELETE /api/v1/categories/:id
// @access Private
const deleteCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteCategoryById(id);

  APIResponse.send(
    res,
    APIResponse.success(null, 200, "Category deleted successfully")
  );
});

module.exports = {
  getCategoryByIdController,
  getCategoriesController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
