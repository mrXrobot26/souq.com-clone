# Souq.com Reusable Components Documentation

## Table of Contents

- [Overview](#overview)
- [Core Components](#core-components)
  - [APIFeatures](#apifeatures)
  - [factoryHandler](#factoryhandler)
  - [uploadMiddleware](#uploadmiddleware)
  - [APIResponse](#apiresponse)
  - [APIError](#apierror)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)

## Overview

This document provides detailed information about reusable components in the Souq.com e-commerce platform. These components are designed to be modular and can be easily integrated into other projects. They provide common functionality for API development, error handling, data manipulation, and file uploads.

## Core Components

### APIFeatures

**Location**: `utils/APIFeatures.js`

**Purpose**: Handles MongoDB query operations like filtering, sorting, field limiting, pagination, and searching.

**Features**:

- Advanced filtering with MongoDB operators (gte, gt, lte, lt)
- Sorting by multiple fields
- Field selection/projection
- Pagination with customizable page size
- Keyword search across multiple fields

**Implementation**:

The `APIFeatures` class uses method chaining to build complex MongoDB queries in a readable way:

```javascript
const features = new APIFeatures(Model.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .search(["title", "description"])
  .paginate();

const results = await features.query;
```

**Configuration Options**:

- `searchFields`: Array of fields to search in when using the search method
- `queryString`: Express request.query object containing filter parameters

### factoryHandler

**Location**: `utils/factoryHandler.js`

**Purpose**: Provides reusable handler functions for common database operations (CRUD).

**Features**:

- Generic handlers for create, read, update, delete operations
- Support for single and bulk operations
- Automatic error handling and response formatting
- Population of related documents

**Implementation**:

```javascript
// Example: Create a controller for getting all categories
const getAllCategories = factoryHandler.getAll(
  Category,
  ["name"],
  [{ path: "subcategories" }]
);

// Example: Create a controller for deleting a product
const deleteProduct = factoryHandler.deleteOne(Product, "Product");
```

**Configuration Options**:

- `Model`: Mongoose model to operate on
- `modelName`: Name of the model for error messages
- `populateOptions`: Array of populate options for related documents
- `searchFields`: Fields to search in when using keyword search

### uploadMiddleware

**Location**: `middlewares/uploadMiddleware.js`

**Purpose**: Handles file uploads with support for image processing and validation.

**Features**:

- File upload handling with multer
- Image processing with sharp
- Support for both disk and memory storage
- Automatic file naming with UUID
- Image resizing and format conversion

**Implementation**:

```javascript
// Example: Create an upload middleware for product images
const upload = uploadMiddleware.createUpload({
  storageType: "memory",
  fieldName: "productImage",
});

// Example: Add image processing middleware
const processImage = uploadMiddleware.resizeImage({
  destination: "uploads/products",
  width: 800,
  height: 600,
  format: "jpeg",
  quality: 90,
  fileNamePrefix: "product",
});

// Use in route
router.post("/products", upload, processImage, createProduct);
  "/products/multiple",
  uploadMultiple,
  processMultipleImages,
  createProduct
);
```
- `height`: Target height for resized images
- `format`: Output format (jpeg, png, etc)
- `quality`: Image quality (1-100)
- `fileNamePrefix`: Prefix for the output filename
- `bodyField`: Field name to store image filenames in req.body (for multiple uploads)
- `fieldName`: Name of the form field for the file
- `width`: Target width for resized image
- `height`: Target height for resized image
- `format`: Output format (jpeg, png, etc.)
- `quality`: Image quality (1-100)
- `fileNamePrefix`: Prefix for the output filename

### APIResponse

**Location**: `utils/APIResponse.js`

**Purpose**: Standardizes API responses following JSend specification.

**Features**:

- Consistent response format across the application
- Support for success, fail, and error responses
- Automatic HTTP status code handling
- Optional additional data and message fields

**Implementation**:

```javascript
// Example: Success response
return APIResponse.send(
  res,
  APIResponse.success({ user: userData }, 200, "User created successfully")
);

// Example: Error response
return APIResponse.send(
  res,
  APIResponse.error("Internal server error", 500, {
    errorCode: "DB_CONNECTION_FAILED",
  })
);
```

**Configuration Options**:

- `data`: The data to be returned in the response
- `statusCode`: HTTP status code
- `message`: Optional success or error message

### APIError

**Location**: `utils/APIError.js`

**Purpose**: Custom error class for operational errors in the API.

**Features**:

- Extends the native Error class
- Includes HTTP status code
- Automatically determines error status based on status code
- Marks errors as operational for global error handling

**Implementation**:

```javascript
// Example: Throw a not found error
throw new APIError("Product not found", 404);

// Example: Throw a validation error
throw new APIError("Invalid input data", 400);
```

**Configuration Options**:

- `message`: Error message
- `statusCode`: HTTP status code

## Usage Examples

### Complete Example: Product Search API

```javascript
// Controller
const getAllProducts = async (req, res, next) => {
  try {
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .search(["title", "description"])
      .paginate();

    const products = await features.query.populate("category");
    const count = await Product.countDocuments(features.query.getFilter());

    return APIResponse.send(
      res,
      APIResponse.success(features.formatResponse(products, count))
    );
  } catch (error) {
    return next(new APIError(error.message, 500));
  }
};
```

### Factory Handler Example

```javascript
// Routes
router.get(
  "/",
  factoryHandler.getAll(
    Product,
    ["title", "description"],
    [{ path: "category" }, { path: "brand" }]
  )
);

router.get(
  "/:id",
  factoryHandler.getOne(Product, "Product", [
    { path: "category" },
    { path: "brand" },
  ])
);

router.post("/", factoryHandler.createOne(Product, "Product"));

router.put("/:id", factoryHandler.updateOne(Product, "Product"));

router.delete("/:id", factoryHandler.deleteOne(Product, "Product"));
```

## Best Practices

1. **Component Reuse**: Import these components directly into new projects to maintain consistency.

2. **Error Handling**: Always use APIError for operational errors and let the global error handler manage the response.

3. **Response Format**: Use APIResponse for all API responses to ensure a consistent format.

4. **Query Building**: Use APIFeatures for complex queries instead of writing custom query logic.

5. **File Uploads**: Configure uploadMiddleware according to your project's specific needs for file storage and processing.

6. **Factory Handlers**: Use factoryHandler for standard CRUD operations and only write custom controllers for complex business logic.

7. **Configuration**: Create a central configuration file for component settings to make them easily adjustable.

8. **Testing**: Write unit tests for each component to ensure they work as expected in different scenarios.
