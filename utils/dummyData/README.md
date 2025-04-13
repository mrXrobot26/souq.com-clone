# Souq.com Data Seeder

This utility allows you to easily populate your MongoDB database with dummy data for development and testing purposes.

## Available Collections

- Categories
- Subcategories
- Brands
- Products

## Usage

```bash
node seeder.js [command] [collections]
```

### Commands

- `-i, --import`: Import data to database
- `-d, --destroy`: Delete data from database
- `-h, --help`: Display help information

### Collections (optional)

- `all`: All collections (default)
- `categories`: Only categories
- `subcategories`: Only subcategories
- `brands`: Only brands
- `products`: Only products

### Examples

```bash
# Import all collections
node seeder.js -i

# Import only categories
node seeder.js -i categories

# Delete only products
node seeder.js -d products

# Import categories and brands
node seeder.js -i categories brands
```

## Data Files

The seeder uses JSON files located in the `utils/dummyData` directory:

- `categories.json`: Category data
- `subcategories.json`: Subcategory data (with references to categories)
- `brands.json`: Brand data
- `products.json`: Product data (with references to categories, subcategories, and brands)

## Automatic Reference Handling

The seeder automatically handles references between collections. When you import categories first, the script will update the subcategories and products JSON files with the correct MongoDB IDs before importing them.

## Note

For best results, import collections in this order:

1. Categories
2. Subcategories
3. Brands
4. Products

Or simply use `node seeder.js -i` to import all collections in the correct order.
