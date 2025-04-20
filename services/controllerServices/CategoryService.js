const Category = require("../../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Factory = require("../../utils/factoryHandler");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");
const APIError = require("../../utils/APIError");

// 1- diskStorage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/category");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     // category-uuid-datetime.now().png
//     const name = `category-${uuid()}-${Date.now()}.${ext}`;
//     cb(null, name);
//   },
// });

// 2- memeoryStorage
const storage = multer.memoryStorage();

const multerFilter = function (_, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new APIError("Only image files are allowed", 400), false);
  }
};
const upload = multer({ storage: storage, fileFilter: multerFilter });
const uploadCategoryImage = upload.single("image");

const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuid()}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/category/${fileName}`);

  req.body.image = fileName;
  next();
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
  resizeImage,
};
