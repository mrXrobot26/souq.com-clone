const Product = require("../../models/productModel");
const slugify = require("slugify");
const APIError = require("../../utils/APIError");
const asyncHandler = require("express-async-handler");


const createProduct = asyncHandler(async (req) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  const populatedProduct = await Product.findById(product._id).populate([
    { path: "category", select: "name" },
    { path: "subCategory", select: "name" },
    { path: "brand", select: "name" },
  ]);
  return {
    data: populatedProduct,
  };
});

const getProduct = asyncHandler(async (idFromController) => {
  const product = await Product.findById(idFromController).populate([
    { path: "category", select: "name" },
    { path: "subCategory", select: "name" },
    { path: "brand", select: "name" },
  ]);
  if (!product) {
    throw new APIError("Product not found", 404);
  }
  return {
    data: product,
  };
});

const getProducts = asyncHandler(async (req) => {
  const APIFeatures = require("../../utils/APIFeatures");
  
  // Create query with APIFeatures class
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .search(['title', 'description'])
    .paginate();
  
  // Add necessary populate options
  features.query.populate([
    { path: "category", select: "name" },
    { path: "subCategory", select: "name" },
    { path: "brand", select: "name" },
  ]);
  
  // Execute query
  const products = await features.query;
  
  // Get total count for pagination
  const count = await Product.countDocuments(features.query.getFilter());
  
  // Return formatted response
  return features.formatResponse(products, count);
});

const updateProduct = asyncHandler(async (idFromController, req) => {
  const product = await Product.findByIdAndUpdate(
    { _id: idFromController },
    req.body,
    {
      new: true,
    }
  ).populate([
    { path: "category", select: "name" },
    { path: "subCategory", select: "name" },
    { path: "brand", select: "name" },
  ]);
  if (!product) {
    throw new APIError("Product not found", 404);
  }
  return {
    data: product,
  };
});

const deleteProduct = asyncHandler(async (idFromController) => {
  const product = await Product.findByIdAndDelete(idFromController);
  if (!product) {
    throw new APIError("Product not found", 404);
  }
  return {
    message: "Product deleted successfully",
  };
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
