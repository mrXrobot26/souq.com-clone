const Product = require("../../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const factoryHandler = require("../../utils/factoryHandler");

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
};
