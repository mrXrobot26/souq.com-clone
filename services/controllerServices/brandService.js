const { default: slugify } = require("slugify");
const Brand = require("../../models/brandModel");
const asyncHandler = require("express-async-handler");
const factoryHandler = require("../../utils/factoryHandler");

const createBrand = asyncHandler(async (nameFromController) => {
  const brandData = {
    name: nameFromController,
    slug: slugify(nameFromController, { lower: true, strict: true }),
  };
  return await factoryHandler.createOne(Brand)(brandData);
});

const getBrand = asyncHandler(async (idFromController) => {
  return await factoryHandler.getOne(Brand, "Brand")(idFromController);
});

const getBrands = asyncHandler(async (req) => {
  return await factoryHandler.getAll(Brand, ["name"])(req);
});

const updateBrand = asyncHandler(
  async (idFromController, nameFromController) => {
    const updateData = {
      name: nameFromController,
      slug: slugify(nameFromController, { lower: true, strict: true }),
    };

    return await factoryHandler.updateOne(Brand, "Brand")(
      idFromController,
      updateData
    );
  }
);

const deleteBrand = asyncHandler(async (idFromController) => {
  return await factoryHandler.deleteOne(Brand, "Brand")(idFromController);
});

module.exports = {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
};
