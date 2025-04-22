const Product = require("../../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const factoryHandler = require("../../utils/factoryHandler");
const {
  createUpload,
  resizeImage,
} = require("../../middlewares/uploadMiddleware");

// Create upload middleware for product images
const uploadProductImages = createUpload({
  storageType: "memory",
  field: [
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ],
});

// Configure image processing middleware for product images
const processProductImages = resizeImage({
  width: 2000,
  height: 1333,
  format: "jpeg",
  fileNamePrefix: "products",
  fields: {
    imageCover: {
      destination: "uploads/products/imageCover",
      quality: 90,
      fileNamePrefix: "products",
    },
    images: {
      destination: "uploads/products/productImage",
      quality: 95,
      fileNamePrefix: "products",
    },
  },
});

const populateOptions = [
  { path: "category", select: "name" },
  { path: "subCategory", select: "name" },
  { path: "brand", select: "name" },
];

const createProduct = asyncHandler(async (req) => {
  req.body.slug = slugify(req.body.title);
  return await factoryHandler.createOne(Product, populateOptions)(req.body);
});

const getProduct = asyncHandler(async (idFromController) => {
  return await factoryHandler.getOne(
    Product,
    "Product",
    populateOptions
  )(idFromController);
});

const getProducts = asyncHandler(async (req) => {
  return await factoryHandler.getAll(
    Product,
    ["title", "description"],
    populateOptions
  )(req);
});

const updateProduct = asyncHandler(async (idFromController, req) => {
  return await factoryHandler.updateOne(
    Product,
    "Product",
    populateOptions
  )(idFromController, req.body);
});

const deleteProduct = asyncHandler(async (idFromController) => {
  return await factoryHandler.deleteOne(Product, "Product")(idFromController);
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  processProductImages,
};
