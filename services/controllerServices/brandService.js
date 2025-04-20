const { default: slugify } = require("slugify");
const Brand = require("../../models/brandModel");
const asyncHandler = require("express-async-handler");
const factoryHandler = require("../../utils/factoryHandler");

const {
  createUpload,
  resizeImage,
} = require("../../middlewares/uploadMiddleware");

const uploadBrandImage = createUpload({
  storageType: "memory",
  destination: "uploads/brand",
  fieldName: "image",
});

const processBrandImage = resizeImage({
  destination: "uploads/brand",
  width: 600,
  height: 600,
  format: "jpeg",
  quality: 95,
  fileNamePrefix: "brand",
});

const createBrand = asyncHandler(async (data) => {
  const brandData = {
    name: data.name,
    slug: slugify(data.name, { lower: true, strict: true }),
    image: data.image,
  };
  return await factoryHandler.createOne(Brand)(brandData);
});

const getBrand = asyncHandler(async (idFromController) => {
  return await factoryHandler.getOne(Brand, "Brand")(idFromController);
});

const getBrands = asyncHandler(async (req) => {
  return await factoryHandler.getAll(Brand, ["name"])(req);
});

const updateBrand = asyncHandler(async (idFromController, data) => {
  const updateData = {
    name: data.name,
    slug: slugify(data.name, { lower: true, strict: true }),
    image: data.image,
  };

  return await factoryHandler.updateOne(Brand, "Brand")(
    idFromController,
    updateData
  );
});

const deleteBrand = asyncHandler(async (idFromController) => {
  return await factoryHandler.deleteOne(Brand, "Brand")(idFromController);
});

module.exports = {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  processBrandImage,
};
