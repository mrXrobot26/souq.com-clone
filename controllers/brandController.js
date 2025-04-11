const {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} = require("../services/controllerServices/brandService");
const asyncHandler = require("express-async-handler");
const APIResponse = require("../utils/APIResponse");

const createBrandController = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const brand = await createBrand(name);
  APIResponse.send(
    res,
    APIResponse.success(brand, 201, "Brand created successfully")
  );
});
const getBrandController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const brand = await getBrand(id);
  APIResponse.send(res, APIResponse.success(brand));
});

const getBrandsController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const brands = await getBrands(page, limit);
  APIResponse.send(res, APIResponse.success(brands));
});
const updateBrandController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await updateBrand(id, name);
  APIResponse.send(
    res,
    APIResponse.success(brand, 200, "Brand updated successfully")
  );
});
const deleteBrandController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await deleteBrand(id);
  APIResponse.send(
    res,
    APIResponse.success(result, 200, "Brand deleted successfully")
  );
});

module.exports = {
  createBrandController,
  getBrandController,
  getBrandsController,
  updateBrandController,
  deleteBrandController,
};
