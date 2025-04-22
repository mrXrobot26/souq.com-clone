# Souq.com Project Structure Documentation

## Table of Contents

- [Overview](#overview)
- [Project Architecture](#project-architecture)
- [Directory Structure](#directory-structure)
- [Core Components](#core-components)
  - [Models](#models)
  - [Controllers](#controllers)
  - [Services](#services)
  - [Routers](#routers)
  - [Middlewares](#middlewares)
  - [Utils](#utils)
- [Data Flow](#data-flow)
- [Error Handling](#error-handling)
- [File Upload System](#file-upload-system)

## Overview

Souq.com is a RESTful API for an e-commerce platform built with Node.js, Express, and MongoDB. The project follows a modular architecture with clear separation of concerns.

## Project Architecture

The application follows the additional service layers:

```
Client Request → Router → Middleware → Controller → Service → Model → Database
```

Response flow:

```
Database → Model → Service → Controller → Response Formatting → Client
```

## Directory Structure

```
├── config/
│   └── database.js         # Database connection configuration
├── controllers/            # Request handlers
├── docs/                   # Documentation files
├── middlewares/            # Express middlewares
├── models/                 # MongoDB schema definitions
├── Routers/                # API route definitions
├── services/               # Business logic layer
│   ├── controllerServices/ # Services for controllers
│   └── integrationServices/# External service integrations
├── utils/                  # Utility functions and classes
│   ├── dummyData/          # Seed data for development
│   └── validator/          # Validation schemas
├── uploads/                # Uploaded files storage
└── server.js               # Application entry point
```

## Core Components

### Models

Mongoose schemas that define the data structure for the application:

- **categoryModel.js**: Defines the schema for product categories
- **subCategoryModel.js**: Defines the schema for product subcategories with references to parent categories
- **brandModel.js**: Defines the schema for product brands
- **productModel.js**: Defines the schema for products with references to categories, subcategories, and brands

### Controllers

Handle HTTP requests and responses, delegating business logic to services:

- **categoryController.js**: Handles category-related requests
- **subCategoryController.js**: Handles subcategory-related requests
- **brandController.js**: Handles brand-related requests
- **productController.js**: Handles product-related requests

Controllers use the `express-async-handler` to simplify error handling in async functions.

### Services

Contain the business logic of the application:

- **CategoryService.js**: Business logic for category operations
- **subCategoryService.js**: Business logic for subcategory operations
- **brandService.js**: Business logic for brand operations
- **productService.js**: Business logic for product operations

Services use the factory handler pattern for common CRUD operations.

### Routers

Define API endpoints and connect them to controllers:

- **categoryRouter.js**: Routes for category endpoints
- **subCategoryRouter.js**: Routes for subcategory endpoints
- **brandRouter.js**: Routes for brand endpoints
- **productRouter.js**: Routes for product endpoints

### Middlewares

Process requests before they reach the controllers:

- **gloablErrorHandlingMiddelware.js**: Global error handling middleware
- **uploadMiddleware.js**: File upload and processing middleware with support for single and multiple file uploads, image processing, and configurable storage options
- **validationMiddleware.js**: Request validation middleware

### Utils

Utility classes and functions used throughout the application:

- **APIError.js**: Custom error class for operational errors
- **APIFeatures.js**: Class for handling filtering, sorting, pagination, and field limiting
- **APIResponse.js**: Class for standardizing API responses
- **factoryHandler.js**: Factory functions for common CRUD operations
- **validator/**: Validation schemas for different resources

## Data Flow

1. **Request Routing**: Incoming requests are routed to the appropriate controller based on the URL path.
2. **Middleware Processing**: Requests pass through middleware for validation, authentication, etc.
3. **Controller Processing**: Controllers extract request data and call the appropriate service.
4. **Service Execution**: Services contain the business logic and interact with models.
5. **Database Operations**: Models perform CRUD operations on the database.
6. **Response Formatting**: Controllers format the response using the APIResponse utility.
7. **Error Handling**: Errors are caught and processed by the global error handling middleware.

## Error Handling

The application uses a centralized error handling approach:

1. **APIError Class**: Custom error class for operational errors with status code and message.
2. **express-async-handler**: Middleware to catch async errors and pass them to the error handler.
3. **Global Error Middleware**: Processes all errors and formats responses based on environment.

## File Upload System

The application uses a flexible file upload system:

1. **Multer**: Handles multipart/form-data for file uploads.
2. **Storage Options**: Configurable disk or memory storage.
3. **Image Processing**: Uses Sharp for image resizing, format conversion, and optimization.
4. **File Naming**: Uses UUID for unique filenames to prevent collisions.

File upload middleware can be configured for different resource types (categories, brands, products) with specific settings for each.
