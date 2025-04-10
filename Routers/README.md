# Implementing Nested Routes in Express

This guide explains how to implement nested routes in Express using the pattern demonstrated in the Souq.com application.

## What are Nested Routes?

Nested routes allow you to create hierarchical URL structures that represent relationships between resources. For example, to represent subcategories that belong to a specific category, you might use a URL structure like:

```
/api/v1/categories/:categoryId/subcategories
```

This indicates that subcategories are a sub-resource of categories.

## Implementation Steps

### 1. Set up the Parent Router (categoryRouter.js)

In your parent router, import the child router and use it with the appropriate path parameter:

```javascript
const express = require('express');
const subcategoriesRoute = require('./subCategoryRouter');
const router = express.Router();

// Mount the subcategories router as a nested route
router.use('/:categoryId/subcategories', subcategoriesRoute);

// Other category routes...

module.exports = router;
```

### 2. Configure the Child Router with mergeParams (subCategoryRouter.js)

In your child router, enable `mergeParams` to access parameters from the parent router:

```javascript
const express = require("express");
const router = express.Router({ mergeParams: true });

// Now you can access req.params.categoryId in these routes
router.get("/", validateCategoryId, getSpacificSubCategoriesController);
router.post("/", [validateCreateSubCategory], createSubCategoryController);

// Other subcategory routes...

module.exports = router;
```

**Important**: The `{ mergeParams: true }` option is crucial as it allows the child router to access parameters defined in the parent router.

### 3. Validate Parameters in Validators

In your validators, ensure you validate both the parent and child resource parameters:

```javascript
// In subCategoryValidator.js
const validateCategoryId = [
  param("categoryId").isMongoId().withMessage("Invalid Category ID --EV"),
  validate,
];

const validateCreateSubCategory = [
  body("name")
    .notEmpty()
    .withMessage("SubCategory name is required --EV")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("SubCategory name must be between 3 and 50 characters --EV"),
  param("categoryId").isMongoId().withMessage("Invalid Category ID --EV"),
  validate,
];
```

### 4. Access Parameters in Controllers

In your controller functions, you can now access the parameters from both routers:

```javascript
const createSubCategoryController = AsyncHandler(async (req, res) => {
  const name = req.body.name;
  const { categoryId } = req.params;  // Accessing the parent router parameter

  const result = await createSubCategory(name, categoryId);
  // Rest of the controller...
});
```

## URL Structure and Route Handling

With this setup, your application can handle requests to:

1. **Get all subcategories of a specific category**:
   - URL: `/api/v1/categories/:categoryId/subcategories`
   - Handler: `getSpacificSubCategoriesController`

2. **Create a new subcategory within a specific category**:
   - URL: `/api/v1/categories/:categoryId/subcategories`
   - Method: POST
   - Handler: `createSubCategoryController`


## Benefits of Nested Routes

1. **Clearer API Structure**: URLs clearly represent resource relationships
2. **Improved Data Access Control**: Easily verify if a subcategory belongs to a category
3. **Simplified Frontend Integration**: Frontend developers can understand resource relationships from URLs
4. **Consistent Parameter Naming**: Parameters follow a consistent pattern across the application

## Best Practices

1. Use `mergeParams: true` in nested routers
2. Validate all parameters in your validation middleware
3. Keep route handlers focused on their specific resource operations
4. Use descriptive route comments to document the API endpoints
5. Consider the depth of nesting (avoid going too deep, usually 2-3 levels is practical)

## Example: Complete Flow

When a request comes in to create a new subcategory:

1. The request hits `/api/v1/categories/:categoryId/subcategories`
2. `categoryRouter` passes it to the nested `subCategoryRouter`
3. `subCategoryRouter` applies the `validateCreateSubCategory` middleware
4. The middleware validates both the request body and the `categoryId` parameter
5. If validation passes, `createSubCategoryController` is called
6. The controller extracts `categoryId` from `req.params` and creates the subcategory

This pattern ensures that subcategories are always created within the context of their parent category.