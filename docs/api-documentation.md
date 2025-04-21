# Souq.com API Documentation

## Table of Contents

- [Introduction](#introduction)
- [API Response Format](#api-response-format)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [API Endpoints](#api-endpoints)
  - [Categories](#categories)
  - [Subcategories](#subcategories)
  - [Brands](#brands)
  - [Products](#products)
- [Query Parameters](#query-parameters)
  - [Filtering](#filtering)
  - [Sorting](#sorting)
  - [Pagination](#pagination)
  - [Field Limiting](#field-limiting)

## Introduction

This documentation provides details about the RESTful API for the Souq.com e-commerce platform. The API follows a structured approach with standardized responses and error handling.

## API Response Format

All API responses follow the JSend specification for consistent and predictable response formats:

### Success Response

```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional success message"
}
```

### Fail Response (Client Error)

```json
{
  "status": "fail",
  "data": {
    "message": "Error message"
    // or validation errors
  }
}
```

### Error Response (Server Error)

```json
{
  "status": "error",
  "message": "Error message",
  "data": { ... } // Optional additional error data (development mode only)
}
```

## Error Handling

The API uses a global error handling middleware that processes all errors and returns standardized responses. In development mode, detailed error information is provided, while in production mode, only essential error information is returned.

## File Upload

The API supports file uploads for images using multer middleware. Images are processed using Sharp for resizing and optimization.

### Upload Options

- **Storage Types**: Disk storage or memory storage
- **File Types**: Only image files are allowed
- **Image Processing**: Resize, format conversion, and quality optimization

## API Endpoints

### Categories

| Method | Endpoint                 | Description                        | Access  |
| ------ | ------------------------ | ---------------------------------- | ------- |
| GET    | `/api/v1/categories`     | Get all categories with pagination | Public  |
| GET    | `/api/v1/categories/:id` | Get a specific category by ID      | Public  |
| POST   | `/api/v1/categories`     | Create a new category              | Private |
| PUT    | `/api/v1/categories/:id` | Update an existing category        | Private |
| DELETE | `/api/v1/categories/:id` | Delete a category                  | Private |

#### Category Object

```json
{
  "_id": "60f7b0b9e8b4a43b3c3f9b1a",
  "name": "Electronics",
  "slug": "electronics",
  "image": "category-uuid-timestamp.jpeg",
  "createdAt": "2021-07-21T12:00:00.000Z",
  "updatedAt": "2021-07-21T12:00:00.000Z"
}
```

### Subcategories

| Method | Endpoint                                       | Description                                  | Access  |
| ------ | ---------------------------------------------- | -------------------------------------------- | ------- |
| GET    | `/api/v1/subcategories`                        | Get all subcategories                        | Public  |
| GET    | `/api/v1/subcategories/:id`                    | Get a specific subcategory                   | Public  |
| GET    | `/api/v1/categories/:categoryId/subcategories` | Get subcategories for a specific category    | Public  |
| POST   | `/api/v1/categories/:categoryId/subcategories` | Create a subcategory for a specific category | Private |
| PUT    | `/api/v1/subcategories/:id`                    | Update a subcategory                         | Private |
| DELETE | `/api/v1/subcategories/:id`                    | Delete a subcategory                         | Private |

#### Subcategory Object

```json
{
  "_id": "60f7b0b9e8b4a43b3c3f9b1b",
  "name": "Smartphones",
  "slug": "smartphones",
  "category": "60f7b0b9e8b4a43b3c3f9b1a",
  "createdAt": "2021-07-21T12:00:00.000Z",
  "updatedAt": "2021-07-21T12:00:00.000Z"
}
```

### Brands

| Method | Endpoint             | Description          | Access  |
| ------ | -------------------- | -------------------- | ------- |
| GET    | `/api/v1/brands`     | Get all brands       | Public  |
| GET    | `/api/v1/brands/:id` | Get a specific brand | Public  |
| POST   | `/api/v1/brands`     | Create a new brand   | Private |
| PUT    | `/api/v1/brands/:id` | Update a brand       | Private |
| DELETE | `/api/v1/brands/:id` | Delete a brand       | Private |

#### Brand Object

```json
{
  "_id": "60f7b0b9e8b4a43b3c3f9b1c",
  "name": "Apple",
  "slug": "apple",
  "image": "brand-uuid-timestamp.jpeg",
  "createdAt": "2021-07-21T12:00:00.000Z",
  "updatedAt": "2021-07-21T12:00:00.000Z"
}
```

### Products

| Method | Endpoint               | Description            | Access  |
| ------ | ---------------------- | ---------------------- | ------- |
| GET    | `/api/v1/products`     | Get all products       | Public  |
| GET    | `/api/v1/products/:id` | Get a specific product | Public  |
| POST   | `/api/v1/products`     | Create a new product   | Private |
| PUT    | `/api/v1/products/:id` | Update a product       | Private |
| DELETE | `/api/v1/products/:id` | Delete a product       | Private |

#### Product Object

```json
{
  "_id": "60f7b0b9e8b4a43b3c3f9b1d",
  "title": "iPhone 13 Pro",
  "slug": "iphone-13-pro",
  "description": "The latest iPhone with advanced features",
  "quantity": 50,
  "sold": 10,
  "price": 999,
  "priceAfterDiscount": 899,
  "colors": ["Black", "Silver", "Gold"],
  "imageCover": "product-uuid-timestamp-cover.jpeg",
  "images": ["product-uuid-timestamp-1.jpeg", "product-uuid-timestamp-2.jpeg"],
  "category": "60f7b0b9e8b4a43b3c3f9b1a",
  "subcategories": ["60f7b0b9e8b4a43b3c3f9b1b"],
  "brand": "60f7b0b9e8b4a43b3c3f9b1c",
  "ratingsAverage": 4.5,
  "ratingsQuantity": 20,
  "createdAt": "2021-07-21T12:00:00.000Z",
  "updatedAt": "2021-07-21T12:00:00.000Z"
}
```

## Query Parameters

The API supports various query parameters for filtering, sorting, pagination, and field limiting.

### Filtering

You can filter results using MongoDB query operators:

```
/api/v1/products?price[gte]=100&price[lte]=200
```

Supported operators:

- `[eq]`: Equal
- `[ne]`: Not equal
- `[gt]`: Greater than
- `[gte]`: Greater than or equal
- `[lt]`: Less than
- `[lte]`: Less than or equal
- `[in]`: In array
- `[nin]`: Not in array

### Sorting

Sort results by one or more fields:

```
/api/v1/products?sort=price,-createdAt
```

- Use comma-separated fields for multiple sort criteria
- Prefix field with `-` for descending order

### Pagination

Control the number of results per page and the current page:

```
/api/v1/products?page=2&limit=10
```

- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 50)

Pagination response includes:

```json
{
  "results": 10,
  "totalCount": 100,
  "totalPages": 10,
  "currentPage": 2,
  "data": [ ... ]
}
```

### Field Limiting

Select specific fields to include in the response:

```
/api/v1/products?fields=title,price,ratingsAverage
```

- Use comma-separated field names
- Prefix field with `-` to exclude fields

## Factory Handler Pattern

The API uses a factory handler pattern to create reusable CRUD operations across different controllers:

- `getOne`: Retrieve a single document by ID
- `getAll`: Retrieve multiple documents with filtering, sorting, and pagination
- `createOne`: Create a new document
- `updateOne`: Update an existing document
- `deleteOne`: Delete a document by ID

This pattern ensures consistent behavior and reduces code duplication across different resource controllers.
