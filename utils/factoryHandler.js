/**
 * Factory Handler for CRUD Operations
 * Provides reusable handler functions for common database operations
 */
const asyncHandler = require("express-async-handler");
const APIError = require("./APIError");
const APIFeatures = require("./APIFeatures");

/**
 * Factory function to delete a document by ID
 * @param {Model} Model - Mongoose model
 * @param {String} modelName - Name of the model for error messages
 * @returns {Function} - Async handler function that deletes a document
 */
exports.deleteOne = (Model, modelName = "Document") => asyncHandler(async (id) => {
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      throw new APIError(`${modelName} not found`, 404);
    }

    return {
      message: `${modelName} deleted successfully`,
    };
  });

/**
 * Factory function to delete multiple documents by filter
 * @param {Model} Model - Mongoose model
 * @param {String} modelName - Name of the model for error messages
 * @returns {Function} - Async handler function that deletes multiple documents
 */
exports.deleteMany = (Model, modelName = "Documents") => asyncHandler(async (filter = {}) => {
    const result = await Model.deleteMany(filter);

    return {
      message: `${result.deletedCount} ${modelName} deleted successfully`,
    };
  });

/**
 * Factory function to get a document by ID
 * @param {Model} Model - Mongoose model
 * @param {String} modelName - Name of the model for error messages
 * @param {Array} populateOptions - Array of populate options
 * @returns {Function} - Async handler function that gets a document
 */
exports.getOne = (Model, modelName = "Document", populateOptions = []) => asyncHandler(async (id) => {
    let query = Model.findById(id);

    if (populateOptions.length > 0) {
      populateOptions.forEach((option) => {
        query = query.populate(option);
      });
    }

    const document = await query;

    if (!document) {
      throw new APIError(`${modelName} not found`, 404);
    }

    return {
      data: document,
    };
  });

/**
 * Factory function to get all documents with filtering, sorting, pagination
 * @param {Model} Model - Mongoose model
 * @param {Array} searchFields - Fields to search in
 * @param {Array} populateOptions - Array of populate options
 * @returns {Function} - Async handler function that gets documents
 */
exports.getAll = (Model, searchFields = ["name"], populateOptions = []) => asyncHandler(async (req) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .search(searchFields)
      .paginate();

    if (populateOptions.length > 0) {
      populateOptions.forEach((option) => {
        features.query.populate(option);
      });
    }

    // Execute query
    const documents = await features.query;

    // Get total count for pagination
    const count = await Model.countDocuments(features.query.getFilter());

    // Return formatted response
    return features.formatResponse(documents, count);
  });

/**
 * Factory function to create a document
 * @param {Model} Model - Mongoose model
 * @param {Array} populateOptions - Array of populate options
 * @returns {Function} - Async handler function that creates a document
 */
exports.createOne = (Model, populateOptions = []) => asyncHandler(async (data) => {
    const document = await Model.create(data);

    let populatedDocument = document;

    if (populateOptions.length > 0) {
      let query = Model.findById(document._id);

      populateOptions.forEach((option) => {
        query = query.populate(option);
      });

      populatedDocument = await query;
    }

    return {
      data: populatedDocument,
    };
  });

/**
 * Factory function to update a document
 * @param {Model} Model - Mongoose model
 * @param {String} modelName - Name of the model for error messages
 * @param {Array} populateOptions - Array of populate options
 * @returns {Function} - Async handler function that updates a document
 */
exports.updateOne = (Model, modelName = "Document", populateOptions = []) => asyncHandler(async (id, data) => {
    let query = Model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (populateOptions.length > 0) {
      populateOptions.forEach((option) => {
        query = query.populate(option);
      });
    }

    const document = await query;

    if (!document) {
      throw new APIError(`${modelName} not found`, 404);
    }

    return {
      data: document,
    };
  });
