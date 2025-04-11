const { createBrand } = require("../services/controllerServices/brandService");
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

module.exports = {
  createBrandController,
};
