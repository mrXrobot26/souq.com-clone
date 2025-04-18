const Product = require("../../models/productModel");
const slugify = require("slugify");
const APIError = require("../../utils/APIError");

const createProduct = async (req) => {
  try {
    req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);
    // Populate the product with category, subCategory and brand data
    const populatedProduct = await Product.findById(product._id).populate([
      { path: "category", select: "name" },
      { path: "subCategory", select: "name" },
      { path: "brand", select: "name" },
    ]);
    return {
      data: populatedProduct,
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message, 500);
  }
};

const getProduct = async (idFromController) => {
  try {
    if (!idFromController) {
      throw new APIError("Product id is required", 400);
    }
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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message, 500);
  }
};

const getProducts = async (req) => {
  try {
    //1-filltring
    const queryStringObj = { ...req.query };
    const excludeParams = ["page", "limit"];
    Object.keys(queryStringObj).forEach((key) => {
      if (excludeParams.includes(key)) {
        delete queryStringObj[key];
      }
    });
    //2- pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // build query =>
    /**
     * Builds a Mongoose query to fetch products with pagination and populated references
     * Building the query first before execution allows for:
     * - Query optimization and reusability
     * - Ability to chain additional query methods
     * - Deferred execution until needed
     * - Better memory management for large datasets
     * @param {Object} queryStringObj - Filter conditions for products
     * @param {number} skip - Number of documents to skip for pagination
     * @param {number} limit - Maximum number of documents to return
     * @returns {mongoose.Query} Mongoose query that will fetch products with populated category, subCategory and brand names
     */

    const mongooseQuery = Product.find(queryStringObj)
      .skip(skip)
      .limit(limit)
      .populate([
        { path: "category", select: "name" },
        { path: "subCategory", select: "name" },
        { path: "brand", select: "name" },
      ]);
    // execut query
    const products = await mongooseQuery;

    const count = await Product.countDocuments();
    return {
      results: products.length,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: products,
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message, 500);
  }
};

const updateProduct = async (idFromController, req) => {
  try {
    if (!idFromController) {
      throw new APIError("Product id is required", 400);
    }
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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message, 500);
  }
};

const deleteProduct = async (idFromController) => {
  try {
    if (!idFromController) {
      throw new APIError("Product id is required", 400);
    }
    const product = await Product.findByIdAndDelete(idFromController);
    if (!product) {
      throw new APIError("Product not found", 404);
    }
    return {
      message: "Product deleted successfully",
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message, 500);
  }
};

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
