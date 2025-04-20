const Category = require("../../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Factory = require("../../utils/factoryHandler");
const {
  createUpload,
  resizeImage,
} = require("../../middlewares/uploadMiddleware");

// Create upload middleware with memory storage
const uploadCategoryImage = createUpload({
  storageType: "memory",
  destination: "uploads/category",
  fieldName: "image",
});

// Configure image processing middleware
const processCategoryImage = resizeImage({
  destination: "uploads/category",
  width: 600,
  height: 600,
  format: "jpeg",
  quality: 95,
  fileNamePrefix: "category",
});

const getCategoryById = asyncHandler(async (id) => {
  return await Factory.getOne(Category, "Category")(id);
});

const getCategories = asyncHandler(async (req) => {
  return await Factory.getAll(Category, "Category")(req);
});

const createCategory = asyncHandler(async (data) => {
  const categoryData = {
    name: data.name,
    slug: slugify(data.name),
    image: data.image,
  };
  return await Factory.createOne(Category)(categoryData);
});

const updateCategory = asyncHandler(
  async (idFromController, dataFromController) => {
    const updateData = {
      name: dataFromController.name,
      slug: slugify(dataFromController.name),
    };

    // Add image to updateData if it exists in the request body
    if (dataFromController.image) {
      updateData.image = dataFromController.image;
    }

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
  uploadCategoryImage,
  processCategoryImage,
};
