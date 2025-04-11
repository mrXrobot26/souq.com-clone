const express = require("express");
const router = express.Router();
const {
  createBrandController,
  getBrandController,
  getBrandsController,
  updateBrandController,
  deleteBrandController,
} = require("../controllers/brandController");

router.post("/", createBrandController);
router.get("/:id", getBrandController);
router.get("/", getBrandsController);
router.put("/:id", updateBrandController);
router.delete("/:id", deleteBrandController);

module.exports = router;
