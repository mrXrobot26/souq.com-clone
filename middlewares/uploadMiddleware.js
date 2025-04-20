const multer = require("multer");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
const APIError = require("../utils/APIError");
const asyncHandler = require("express-async-handler");

/**
 * Configure multer disk storage
 * @param {string} destination - The folder where files will be saved
 * @returns {object} - Configured multer disk storage
 */
const getDiskStorage = (destination) => {
  // Ensure the destination directory exists
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      const name = `${path.basename(destination)}-${uuid()}-${Date.now()}.${ext}`;
      cb(null, name);
    },
  });
};

/**
 * Configure multer memory storage
 * @returns {object} - Configured multer memory storage
 */
const getMemoryStorage = () => {
  return multer.memoryStorage();
};

/**
 * Filter function to allow only image files
 * @param {object} req - Express request object
 * @param {object} file - Uploaded file object
 * @param {function} cb - Callback function
 */
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new APIError("Only image files are allowed", 400), false);
  }
};

/**
 * Create a multer upload instance
 * @param {string} storageType - Type of storage ('disk' or 'memory')
 * @param {string} destination - Destination folder for disk storage
 * @param {string} fieldName - Name of the form field for the file
 * @returns {object} - Configured multer upload instance
 */
const createUpload = ({
  storageType = "memory",
  destination = "uploads",
  fieldName = "image",
}) => {
  let storage;

  if (storageType === "disk") {
    storage = getDiskStorage(destination);
  } else {
    storage = getMemoryStorage();
  }

  const upload = multer({ storage, fileFilter: multerFilter });
  return upload.single(fieldName);
};

/**
 * Resize and process uploaded image
 * @param {object} options - Configuration options
 * @param {string} options.destination - Destination folder for processed image
 * @param {number} options.width - Target width for resized image
 * @param {number} options.height - Target height for resized image
 * @param {string} options.format - Output format (jpeg, png, etc)
 * @param {number} options.quality - Image quality (1-100)
 * @param {string} options.fileNamePrefix - Prefix for the output filename
 * @returns {function} - Express middleware function
 */
const resizeImage = ({
  destination = "uploads",
  width = 600,
  height = 600,
  format = "jpeg",
  quality = 95,
  fileNamePrefix = "image",
}) => {
  // Ensure the destination directory exists
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  return asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    const fileName = `${fileNamePrefix}-${uuid()}-${Date.now()}.${format}`;
    const filePath = `${destination}/${fileName}`;

    await sharp(req.file.buffer)
      .resize(width, height)
      .toFormat(format)
      [format]({ quality })
      .toFile(filePath);

    req.body.image = fileName;
    next();
  });
};

module.exports = {
  createUpload,
  resizeImage,
  getDiskStorage,
  getMemoryStorage,
  multerFilter,
};
