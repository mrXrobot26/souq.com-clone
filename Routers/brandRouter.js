const express = require("express");
const router = express.Router();
const {
  createBrandController,
  getBrandController,
} = require("../controllers/brandController");

router.post("/", createBrandController);
router.get("/:id", getBrandController);

module.exports = router;
