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
- Support for multiple file uploads (same field or different fields)
- Configurable image processing per field

#### createUpload Function

**Parameters**:

- `storageType`: Type of storage ('disk' or 'memory', default: 'memory')
- `destination`: Destination folder for disk storage (default: 'uploads')
- `field`: Name of the form field for the file or fields configuration for multiple uploads (default: 'image')
- `fieldName`: (Legacy parameter) Alternative to `field` for backward compatibility
- `multiple`: Whether to handle multiple files with the same field name (default: false)

**Usage Examples**:

```javascript
// Single file upload
const uploadSingle = createUpload({
  storageType: "memory",
  field: "image",
});

// Multiple files with the same field name
const uploadMultiple = createUpload({
  storageType: "memory",
  field: "images",
  multiple: true,
});

// Multiple fields with different configurations
const uploadProductImages = createUpload({
  storageType: "memory",
  field: [
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ],
});
```

#### resizeImage Function

**Parameters**:

- `destination`: Destination folder for processed images (default: 'uploads')
- `width`: Target width for resized images (default: 600)
- `height`: Target height for resized images (default: 600)
- `format`: Output format (jpeg, png, etc.) (default: 'jpeg')
- `quality`: Image quality (1-100) (default: 95)
- `fileNamePrefix`: Prefix for the output filename (default: 'image')
- `fields`: Configuration for multiple fields processing (default: null)

**Usage Examples**:

```javascript
// Single image processing
const processSingleImage = resizeImage({
  destination: "uploads/products",
  width: 800,
  height: 600,
  format: "jpeg",
  quality: 90,
  fileNamePrefix: "product",
});

// Multiple fields with different configurations
const processProductImages = resizeImage({
  width: 2000,
  height: 1333,
  format: "jpeg",
  fileNamePrefix: "products",
  fields: {
    imageCover: {
      destination: "uploads/products/imageCover",
      quality: 90,
      fileNamePrefix: "products",
    },
    images: {
      destination: "uploads/products/productImage",
      quality: 95,
      fileNamePrefix: "products",
    },
  },
});
```

**Route Implementation**:

```javascript
// Single file upload and processing
router.post(
  "/categories",
  uploadCategoryImage,
  processCategoryImage,
  createCategory
);

// Multiple fields with different configurations
router.post(
  "/products",
  uploadProductImages,
  processProductImages,
  createProduct
);
```

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
