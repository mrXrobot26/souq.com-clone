const {
  createBrand,
  getBrand,
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
module.exports = {
  createBrandController,
  getBrandController,
};
