const Category = require("../../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Factory = require("../../utils/factoryHandler");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const APIError = require("../../utils/APIError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/category");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    // category-uuid-datetime.now().png
    const name = `category-${uuid()}-${Date.now()}.${ext}`;
    cb(null, name);
  },
});
const multerFilter = function (_, file, cb) {
    if(file.mimetype.startsWith("image")){
      cb(null, true)
    }else{
      cb(new APIError('Only image files are allowed',400), false)
    }
};
const upload = multer({ storage: storage, fileFilter: multerFilter });

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
  upload,
};
