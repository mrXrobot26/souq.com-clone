const express = require("express");
const router = express.Router();
const { createBrandController } = require("../controllers/brandController");

router.post("/", createBrandController);

module.exports = router;
