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
    const {
      parseReqQueryParamsToMatchMongooStructure,
      getPaginationParams,
      formatPaginatedResponse,
    } = require("../../utils/queryUtils");
    const excludeParams = ["page", "limit", "sort"];
    const parsedQuery = parseReqQueryParamsToMatchMongooStructure(
      req.query,
      excludeParams
    );
    const paginationParams = getPaginationParams(req.query);
    const { skip, limit } = paginationParams;
    let mongooseQuery = Product.find(parsedQuery)
      .skip(skip)
      .limit(limit)
      .populate([
        { path: "category", select: "name" },
        { path: "subCategory", select: "name" },
        { path: "brand", select: "name" },
      ]);
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
      mongooseQuery = mongooseQuery.sort("-createdAt");
    }
    const products = await mongooseQuery;
    const count = await Product.countDocuments(parsedQuery);
    return formatPaginatedResponse(products, count, paginationParams);
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
