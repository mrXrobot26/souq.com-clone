const Product = require("../../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const factoryHandler = require("../../utils/factoryHandler");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");

fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new APIError("Only images are allowed", 400), false);
  }
};
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});

const uploadProductImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
const resizeProductImages = asyncHandler(async (req, res, next) => {
  console.log(req.files);

  if (req.files.imageCover) {
    req.body.imageCover = `products-${uuid()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/imageCover/${req.body.imageCover}`);
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `products-${uuid()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/productImage/${imageName}`);

        req.body.images.push(imageName);
      })
    );
  }
  next();
});

const populateOptions = [
  { path: "category", select: "name" },
  { path: "subCategory", select: "name" },
  { path: "brand", select: "name" },
];

const createProduct = asyncHandler(async (req) => {
  req.body.slug = slugify(req.body.title);
  return await factoryHandler.createOne(Product, populateOptions)(req.body);
});

const getProduct = asyncHandler(async (idFromController) => {
  return await factoryHandler.getOne(
    Product,
    "Product",
    populateOptions
  )(idFromController);
});

const getProducts = asyncHandler(async (req) => {
  return await factoryHandler.getAll(
    Product,
    ["title", "description"],
    populateOptions
  )(req);
});

const updateProduct = asyncHandler(async (idFromController, req) => {
  return await factoryHandler.updateOne(
    Product,
    "Product",
    populateOptions
  )(idFromController, req.body);
});

const deleteProduct = asyncHandler(async (idFromController) => {
  return await factoryHandler.deleteOne(Product, "Product")(idFromController);
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
};
