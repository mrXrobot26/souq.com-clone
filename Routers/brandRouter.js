const express = require("express");
const router = express.Router();
const {
  createBrandController,
  getBrandController,
  getBrandsController,
  updateBrandController,
  deleteBrandController,
} = require("../controllers/brandController");
const {
  validateBrandId,
  validateBrand,
  validatePagination,
} = require("../utils/validator/brandValidator");

const {
  uploadBrandImage,
  processBrandImage,
} = require("../services/controllerServices/brandService");

router.post(
  "/",
  uploadBrandImage,
  processBrandImage,
  validateBrand,
  createBrandController
);
router.get("/:id", validateBrandId, getBrandController);
router.get("/", validatePagination, getBrandsController);
router.put(
  "/:id",
  uploadBrandImage,
  processBrandImage,
  validateBrandId,
  validateBrand,
  updateBrandController
);
router.delete("/:id", validateBrandId, deleteBrandController);

module.exports = router;
