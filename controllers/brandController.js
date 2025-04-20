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
  const brand = await createBrand(req.body);
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
  const brands = await getBrands(req);
  APIResponse.send(res, APIResponse.success(brands));
});
const updateBrandController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const brand = await updateBrand(id, req.body);
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
