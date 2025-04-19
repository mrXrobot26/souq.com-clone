const Category = require("../../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Factory = require("../../utils/factoryHandler");

const getCategoryById = asyncHandler(async (id) => {
  return await Factory.getOne(Category, "Category")(id);
});

const getCategories = asyncHandler(async (req) => {
  return await Factory.getAll(Category, "Category")(req);
});

const createCategory = asyncHandler(async (nameFromController) => {
  const categoryData = {
    name: nameFromController,
    slug: slugify(nameFromController),
  };
  return await Factory.createOne(Category)(categoryData);
});

const updateCategory = asyncHandler(
  async (idFromController, nameFromController) => {
    const updateData = {
      name: nameFromController,
      slug: slugify(nameFromController),
    };
    return await Factory.updateOne(Category)(idFromController, updateData);
  }
);

const deleteCategoryById = asyncHandler(async (idFromController) => {
  return await Factory.deleteOne(Category, "Category")(idFromController);
});

module.exports = {
  getCategoryById,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategoryById,
};
