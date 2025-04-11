const express = require("express");
const router = express.Router();
const {
  createBrandController,
  getBrandController,
  getBrandsController,
} = require("../controllers/brandController");

router.post("/", createBrandController);
router.get("/:id", getBrandController);
router.get("/", getBrandsController);

module.exports = router;
