# Product Filtering Guide

## Comparison Operators

The product API supports the following comparison operators for filtering:

- `gte`: Greater than or equal to
- `gt`: Greater than
- `lte`: Less than or equal to
- `lt`: Less than

## URL Format

To use these operators in your API requests, format your URL as follows:

```
/api/products?field[operator]=value
```

### Examples

1. Get products with price greater than or equal to 100:

   ```
   /api/products?price[gte]=100
   ```

2. Get products with price less than 200:

   ```
   /api/products?price[lt]=200
   ```

3. Get products with rating greater than 4:

   ```
   /api/products?ratingAverage[gt]=4
   ```

4. Get products with quantity less than or equal to 50:

   ```
   /api/products?quantity[lte]=50
   ```

5. Combining multiple filters:
   ```
   /api/products?price[gte]=100&price[lte]=500&ratingAverage[gte]=4
   ```

## Available Fields for Filtering

You can apply these operators to any numeric fields in the product model, including:

- `price`: Product price
- `priceAfterDiscount`: Discounted price
- `quantity`: Available quantity
- `sold`: Number of items sold
- `ratingAverage`: Average rating (1-5)
- `ratingQuantity`: Number of ratings

## Pagination

Pagination parameters work alongside filters:

```
/api/products?price[gte]=100&page=2&limit=20
```

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)
