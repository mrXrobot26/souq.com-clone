const { default: slugify } = require("slugify");
const Brand = require("../../models/brandModel");
const APIError = require("../../utils/APIError");

const createBrand = async (nameFromController) => {
  if (!nameFromController) return new APIError("Brand name is required", 400);
  const brandToDb = await Brand.create({
    name: nameFromController,
    slug: slugify(nameFromController),
  });
  if (!brandToDb) return new APIError("Failed to create brand", 400);
  return {
    data: brandToDb,
  };
};

const getBrand = async (idFromController) => {
  if (!idFromController) return new APIError("Brand Id is required", 400);
  const brandFromDb = await Brand.findById(idFromController);
  if (!brandFromDb) return new APIError("Brand Not Found", 404);
  return {
    data: brandFromDb,
  };
};

const getBrands = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const brandsFromDb = await Brand.find().skip(skip).limit(limit);
  const count = await Brand.countDocuments();
  return {
    results: brandsFromDb.length,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: brandsFromDb,
  };
};

module.exports = {
  createBrand,
  getBrand,
  getBrands,
};
