const Product = require("../../models/productModel");
const slugify = require("slugify");
const APIError = require("../../utils/APIError");

const createProduct = async (req) => {
  try {
    req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);
    return {
      data: product,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new APIError("Product with this title already exists", 400);
    }
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
    const product = await Product.findById(idFromController);
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

const getProducts = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const count = await Product.countDocuments();
    const products = await Product.find().skip(skip).limit(limit);

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
    );
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
