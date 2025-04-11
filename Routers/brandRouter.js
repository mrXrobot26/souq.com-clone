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
  validatePagination
} = require("../utils/validator/brandValidator");

router.post("/", validateBrand, createBrandController);
router.get("/:id", validateBrandId, getBrandController);
router.get("/", validatePagination, getBrandsController);
router.put("/:id", [...validateBrandId, ...validateBrand], updateBrandController);
router.delete("/:id", validateBrandId, deleteBrandController);

module.exports = router;
