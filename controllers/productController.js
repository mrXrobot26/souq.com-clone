const AsyncHandler = require("express-async-handler");
const APIResponse = require("../utils/APIResponse");
const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../services/controllerServices/productService");

const createProductController = AsyncHandler(async (req, res) => {
  const product = await createProduct(req);
  APIResponse.send(
    res,
    APIResponse.success(product.data, 201, "Product created successfully")
  );
});

const getProductController = AsyncHandler(async (req, res) => {
  const product = await getProduct(req.params.id);
  APIResponse.send(
    res,
    APIResponse.success(product.data, 200, "Product retrieved successfully")
  );
});

const getProductsController = AsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const products = await getProducts(page, limit);
  APIResponse.send(
    res,
    APIResponse.success(products, 200, "Products retrieved successfully")
  );
});

const updateProductController = AsyncHandler(async (req, res) => {
  const product = await updateProduct(req.params.id, req);
  APIResponse.send(
    res,
    APIResponse.success(product.data, 200, "Product updated successfully")
  );
});

const deleteProductController = AsyncHandler(async (req, res) => {
  const result = await deleteProduct(req.params.id);
  APIResponse.send(
    res,
    APIResponse.success(result, 200, "Product deleted successfully")
  );
});

module.exports = {
  createProductController,
  getProductController,
  getProductsController,
  updateProductController,
  deleteProductController,
};
