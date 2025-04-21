# Souq.com Models Documentation

## Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [Models](#models)
  - [Category Model](#category-model)
  - [Subcategory Model](#subcategory-model)
  - [Brand Model](#brand-model)
  - [Product Model](#product-model)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Validation](#validation)

## Overview

This document provides detailed information about the database models used in the Souq.com e-commerce platform. The application uses MongoDB as its database with Mongoose as the ODM (Object Document Mapper).

## Database Schema

The database schema follows a relational structure using MongoDB's document references:

```
┌─────────────┐      ┌──────────────┐      ┌─────────┐
│  Category   │──1:N─┤ Subcategory  │      │  Brand  │
└─────────────┘      └──────────────┘      └─────────┘
       │                     │                  │
       │                     │                  │
       └─────────┬───────────┘                  │
                 │                              │
                 │                              │
            ┌────▼──────────────────────────────▼─┐
            │              Product                 │
            └─────────────────────────────────────┘
```

## Models

### Category Model

Represents product categories in the e-commerce platform.

#### Schema Definition

```javascript
const CategorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name Required"],
      minLength: [3, "Min Length of Category Must be 3"],
      maxLength: [32, "Max Length of Category Must be 32"],
      unique: [true, "Category name must be unique"],
    },
    slug: {
      type: String,
      required: [true, "Slug Required"],
      minLength: [3, "Min Length of Category Must be 3"],
      maxLength: [32, "Max Length of Category Must be 32"],
      unique: [true, "Category name must be unique"],
    },
    image: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);
```

#### Fields

| Field     | Type   | Description                  | Validation                                      |
| --------- | ------ | ---------------------------- | ----------------------------------------------- |
| name      | String | Category name                | Required, min length: 3, max length: 32, unique |
| slug      | String | URL-friendly version of name | Required, min length: 3, max length: 32, unique |
| image     | String | Path to category image       | Optional                                        |
| createdAt | Date   | Creation timestamp           | Automatically added                             |
| updatedAt | Date   | Last update timestamp        | Automatically added                             |

### Subcategory Model

Represents product subcategories that belong to a parent category.

#### Schema Definition

```javascript
const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "SubCategory Required"],
      trim: true,
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "Too short SubCategory name"],
      maxlength: [32, "Too long SubCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to parent category"],
    },
  },
  { timestamps: true }
);
```

#### Fields

| Field     | Type     | Description                  | Validation                                      |
| --------- | -------- | ---------------------------- | ----------------------------------------------- |
| name      | String   | Subcategory name             | Required, min length: 2, max length: 32, unique |
| slug      | String   | URL-friendly version of name | Automatically generated from name               |
| category  | ObjectId | Reference to parent category | Required, references Category model             |
| createdAt | Date     | Creation timestamp           | Automatically added                             |
| updatedAt | Date     | Last update timestamp        | Automatically added                             |

### Brand Model

Represents product brands in the e-commerce platform.

#### Schema Definition

```javascript
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minlength: [2, "Too short brand name"],
      maxlength: [32, "Too long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
```

#### Fields

| Field     | Type   | Description                  | Validation                                      |
| --------- | ------ | ---------------------------- | ----------------------------------------------- |
| name      | String | Brand name                   | Required, min length: 2, max length: 32, unique |
| slug      | String | URL-friendly version of name | Automatically generated from name               |
| image     | String | Path to brand image          | Optional                                        |
| createdAt | Date   | Creation timestamp           | Automatically added                             |
| updatedAt | Date   | Last update timestamp        | Automatically added                             |

### Product Model

Represents products in the e-commerce platform.

#### Schema Definition

```javascript
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
```

#### Fields

| Field              | Type       | Description                   | Validation                                   |
| ------------------ | ---------- | ----------------------------- | -------------------------------------------- |
| title              | String     | Product title                 | Required, min length: 3, max length: 100     |
| slug               | String     | URL-friendly version of title | Required, automatically generated from title |
| description        | String     | Product description           | Required, min length: 20                     |
| quantity           | Number     | Available quantity            | Required                                     |
| sold               | Number     | Number of items sold          | Default: 0                                   |
| price              | Number     | Product price                 | Required, max: 200000                        |
| priceAfterDiscount | Number     | Discounted price              | Optional                                     |
| colors             | [String]   | Available colors              | Optional                                     |
| imageCover         | String     | Main product image            | Required                                     |
| images             | [String]   | Additional product images     | Optional                                     |
| category           | ObjectId   | Reference to category         | Required, references Category model          |
| subcategories      | [ObjectId] | References to subcategories   | Optional, references SubCategory model       |
| brand              | ObjectId   | Reference to brand            | Optional, references Brand model             |
| ratingsAverage     | Number     | Average rating                | Optional, min: 1, max: 5                     |
| ratingsQuantity    | Number     | Number of ratings             | Default: 0                                   |
| createdAt          | Date       | Creation timestamp            | Automatically added                          |
| updatedAt          | Date       | Last update timestamp         | Automatically added                          |

## Relationships

- **One-to-Many**: Category to Subcategory
- **One-to-Many**: Category to Product
- **One-to-Many**: Brand to Product
- **Many-to-Many**: Subcategory to Product

## Indexes

The models use various indexes to improve query performance:

- **Category**: Slug field is indexed for faster lookups
- **Subcategory**: Slug and category fields are indexed
- **Brand**: Slug field is indexed
- **Product**: Slug, price, ratingsAverage, and category fields are indexed

## Validation

Validation is implemented at multiple levels:

1. **Schema-level validation**: Using Mongoose schema validators
2. **Request validation**: Using custom validators in the validator directory
3. **Middleware validation**: Using Express middleware for request validation

This multi-layered approach ensures data integrity throughout the application.
