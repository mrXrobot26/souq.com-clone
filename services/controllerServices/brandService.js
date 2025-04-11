const { default: slugify } = require("slugify");
const Brand = require("../../models/brandModel");
const APIError = require("../../utils/APIError");

const createBrand = async (nameFromController) => {
  try {
    if (!nameFromController) {
      throw new APIError("Brand name is required", 400);
    }
    
    const brandToDb = await Brand.create({
      name: nameFromController,
      slug: slugify(nameFromController),
    });
    
    return {
      data: brandToDb,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new APIError('Brand with this name already exists', 400);
    }
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message, 500);
  }
};

const getBrand = async (idFromController) => {
  try {
    if (!idFromController) {
      throw new APIError("Brand Id is required", 400);
    }
    
    const brandFromDb = await Brand.findById(idFromController);
    
    if (!brandFromDb) {
      throw new APIError("Brand not found", 404);
    }
    
    return {
      data: brandFromDb,
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message, 500);
  }
};

const getBrands = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const count = await Brand.countDocuments();
    const brandsFromDb = await Brand.find().skip(skip).limit(limit);
    
    return {
      results: brandsFromDb.length,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: brandsFromDb,
    };
  } catch (error) {
    throw new APIError(error.message, 500);
  }
};

const updateBrand = async (idFromController, nameFromController) => {
  try {
    if (!nameFromController) {
      throw new APIError("Brand name is required", 400);
    }
    
    if (!idFromController) {
      throw new APIError("Brand Id is required", 400);
    }
    
    const brand = await Brand.findOneAndUpdate(
      { _id: idFromController },
      { name: nameFromController, slug: slugify(nameFromController) },
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      throw new APIError("Brand not found", 404);
    }
    
    return {
      data: brand,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new APIError('Brand with this name already exists', 400);
    }
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message, 500);
  }
};

const deleteBrand = async (idFromController) => {
  try {
    if (!idFromController) {
      throw new APIError('Brand Id is required', 400);
    }
    
    const brand = await Brand.findByIdAndDelete(idFromController);
    
    if (!brand) {
      throw new APIError('Brand not found', 404);
    }
    
    return {
      message: 'Brand deleted successfully'
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message, 500);
  }
};

module.exports = {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
};
