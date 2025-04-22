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
 * @param {string|object} field - Name of the form field for the file or fields configuration for multiple uploads
 * @param {boolean} multiple - Whether to handle multiple files (array) or multiple fields
 * @returns {object} - Configured multer upload instance
 */
const createUpload = ({
  storageType = "memory",
  destination = "uploads",
  field = "image",
  multiple = false,
}) => {
  let storage;

  if (storageType === "disk") {
    storage = getDiskStorage(destination);
  } else {
    storage = getMemoryStorage();
  }

  const upload = multer({ storage, fileFilter: multerFilter });

  // Handle different upload scenarios
  if (multiple === true && typeof field === "string") {
    // For multiple files with the same field name
    return upload.array(field);
  } else if (Array.isArray(field)) {
    // For multiple fields with different configurations
    return upload.fields(field);
  } else {
    // Default: single file upload
    return upload.single(field);
  }
};

/**
 * Resize and process uploaded image(s)
 * @param {object} options - Configuration options
 * @param {string} options.destination - Destination folder for processed image
 * @param {number} options.width - Target width for resized image
 * @param {number} options.height - Target height for resized image
 * @param {string} options.format - Output format (jpeg, png, etc)
 * @param {number} options.quality - Image quality (1-100)
 * @param {string} options.fileNamePrefix - Prefix for the output filename
 * @param {object} options.fields - Configuration for multiple fields processing
 * @returns {function} - Express middleware function
 */
const resizeImage = ({
  destination = "uploads",
  width = 600,
  height = 600,
  format = "jpeg",
  quality = 95,
  fileNamePrefix = "image",
  fields = null,
}) => {
  // Ensure the destination directory exists
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  return asyncHandler(async (req, res, next) => {
    // Handle single file upload
    if (req.file) {
      const fileName = `${fileNamePrefix}-${uuid()}-${Date.now()}.${format}`;
      const filePath = `${destination}/${fileName}`;

      await sharp(req.file.buffer)
        .resize(width, height)
        .toFormat(format)
        [format]({ quality })
        .toFile(filePath);

      req.body.image = fileName;
      return next();
    }

    // Handle multiple files with the same field name
    if (req.files && Array.isArray(req.files)) {
      req.body.images = [];

      await Promise.all(
        req.files.map(async (file, index) => {
          const fileName = `${fileNamePrefix}-${uuid()}-${Date.now()}-${index + 1}.${format}`;
          const filePath = `${destination}/${fileName}`;

          await sharp(file.buffer)
            .resize(width, height)
            .toFormat(format)
            [format]({ quality })
            .toFile(filePath);

          req.body.images.push(fileName);
        })
      );

      return next();
    }

    // Handle multiple fields (e.g., imageCover and images)
    if (req.files && !Array.isArray(req.files) && fields) {
      // Process each field according to its configuration
      for (const [fieldName, config] of Object.entries(fields)) {
        if (req.files[fieldName]) {
          const fieldConfig = {
            ...config,
            destination: config.destination || destination,
            format: config.format || format,
            quality: config.quality || quality,
          };

          // Handle single file fields
          if (fieldName !== "images" && req.files[fieldName].length === 1) {
            const fileName = `${fieldConfig.fileNamePrefix || fileNamePrefix}-${uuid()}-${Date.now()}.${fieldConfig.format}`;
            const filePath = `${fieldConfig.destination}/${fileName}`;

            await sharp(req.files[fieldName][0].buffer)
              .resize(fieldConfig.width || width, fieldConfig.height || height)
              .toFormat(fieldConfig.format)
              [fieldConfig.format]({ quality: fieldConfig.quality })
              .toFile(filePath);

            req.body[fieldName] = fileName;
          }
          // Handle multiple files fields
          else if (req.files[fieldName].length > 0) {
            req.body[fieldName] = [];

            await Promise.all(
              req.files[fieldName].map(async (file, index) => {
                const fileName = `${fieldConfig.fileNamePrefix || fileNamePrefix}-${uuid()}-${Date.now()}-${index + 1}.${fieldConfig.format}`;
                const filePath = `${fieldConfig.destination}/${fileName}`;

                await sharp(file.buffer)
                  .resize(
                    fieldConfig.width || width,
                    fieldConfig.height || height
                  )
                  .toFormat(fieldConfig.format)
                  [fieldConfig.format]({ quality: fieldConfig.quality })
                  .toFile(filePath);

                req.body[fieldName].push(fileName);
              })
            );
          }
        }
      }
    }

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
