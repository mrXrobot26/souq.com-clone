const {
  createProductController,
  getProductController,
  getProductsController,
  updateProductController,
  deleteProductController,
} = require("../controllers/productController");

const express = require("express");
const router = express.Router();
const {
  validatePagination,
  validateProduct,
  validateProductId,
} = require("../utils/validator/productValidator");

const {
  processProductImages,
  uploadProductImages,
} = require("../services/controllerServices/productService");

// @desc   Create a new product
// @route  POST /api/v1/products/createProduct
// @access private
router.post(
  "/createProduct",
  uploadProductImages,
  processProductImages,
  validateProduct,
  createProductController
);

// @desc   Get a product by ID
// @route  GET /api/v1/products/:id
// @access public
router.get("/:id", validateProductId, getProductController);

// @desc   Get all products with pagination
// @route  GET /api/v1/products
// @access public
router.get("/", validatePagination, getProductsController);

// @desc   Update a product
// @route  PUT /api/v1/products/:id
// @access private
router.put(
  "/:id",
  uploadProductImages,
  processProductImages,
  [...validateProduct, ...validateProductId],
  updateProductController
);

// @desc   Delete a product
// @route  DELETE /api/v1/products/:id
// @access private
router.delete("/:id", validateProductId, deleteProductController);

module.exports = router;
