# Souq.com Documentation

Welcome to the Souq.com API documentation. This documentation provides comprehensive information about the project structure, API endpoints, and usage guidelines.

## Documentation Files

- [API Documentation](./api-documentation.md) - Detailed information about API endpoints, request/response formats, and query parameters
- [Project Structure](./project-structure.md) - Overview of the project architecture, components, and data flow
- [Filtering Guide](./filtering-guide.md) - Guide for using filtering, sorting, and pagination features

## Quick Start

The Souq.com API is a RESTful e-commerce platform API built with Node.js, Express, and MongoDB. It provides endpoints for managing:

- Categories
- Subcategories
- Brands
- Products

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

Some endpoints require authentication. Authentication details will be added in future updates.

### Response Format

All API responses follow the JSend specification:

```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional success message"
}
```

### Common Query Parameters

- **Filtering**: `/api/v1/products?price[gte]=100&price[lte]=200`
- **Sorting**: `/api/v1/products?sort=price,-createdAt`
- **Pagination**: `/api/v1/products?page=2&limit=10`
- **Field Limiting**: `/api/v1/products?fields=title,price,ratingsAverage`

## Project Features

- RESTful API design
- MongoDB with Mongoose ODM
- Express.js framework
- inspired by onion architecture with service layer
- Factory pattern for CRUD operations
- Image upload and processing
- Error handling middleware
- Request validation
- Filtering, sorting, and pagination

Refer to the specific documentation files for more detailed information on each aspect of the project.
