const fs = require("fs");
require("colors");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
const Brand = require("../../models/brandModel");
const dbConnection = require("../../config/database");

// Configure dotenv with the correct path to .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// connect to DB
dbConnection();

// Read data files
const readJsonFile = (filePath) => {
  try {
    // Use path.resolve to handle relative paths correctly
    const path = require("path");
    const resolvedPath = path.resolve(__dirname, filePath);
    return JSON.parse(fs.readFileSync(resolvedPath));
  } catch (error) {
    console.log(`Error reading file ${filePath}`.red);
    console.log(error);
    return [];
  }
};

// Insert data into DB with proper references
const insertData = async () => {
  try {
    // Clear console
    console.clear();
    console.log("Starting data insertion...".yellow);

    // Check which collections to seed
    const collections = process.argv.slice(3) || ["all"];
    const seedAll = collections.includes("all");

    // Insert categories
    if (seedAll || collections.includes("categories")) {
      const categories = readJsonFile("categories.json");
      console.log("Inserting categories...".cyan);
      const insertedCategories = await Category.create(categories);
      console.log(`${insertedCategories.length} Categories inserted`.green);

      // Update subcategories with real category IDs
      if (fs.existsSync(path.resolve(__dirname, "subcategories.json"))) {
        let subcategories = readJsonFile("subcategories.json");

        // Replace placeholder IDs with real category IDs
        subcategories = subcategories.map((subcat) => {
          const categoryName = subcat.category
            .replace("_ID_PLACEHOLDER", "")
            .toLowerCase();
          const category = insertedCategories.find(
            (c) =>
              c.slug.toLowerCase() === categoryName ||
              c.name.toLowerCase().includes(categoryName)
          );

          if (category) {
            return { ...subcat, category: category._id };
          }
          return subcat;
        });

        // Save updated subcategories file
        fs.writeFileSync(
          path.resolve(__dirname, "subcategories.json"),
          JSON.stringify(subcategories, null, 2)
        );
      }
    }

    // Insert subcategories
    if (seedAll || collections.includes("subcategories")) {
      const subcategories = readJsonFile("subcategories.json");
      console.log("Inserting subcategories...".cyan);
      const insertedSubcategories = await SubCategory.create(subcategories);
      console.log(
        `${insertedSubcategories.length} Subcategories inserted`.green
      );
    }

    // Insert brands
    if (seedAll || collections.includes("brands")) {
      const brands = readJsonFile("brands.json");
      if (brands.length > 0) {
        console.log("Inserting brands...".cyan);
        const insertedBrands = await Brand.create(brands);
        console.log(`${insertedBrands.length} Brands inserted`.green);
      }
    }

    // Insert products
    if (seedAll || collections.includes("products")) {
      let products = readJsonFile("products.json");
      if (products.length > 0) {
        console.log("Inserting products...".cyan);

        // Get all subcategories and brands to replace placeholders
        const subcategories = await SubCategory.find();
        const brands = await Brand.find();

        // Replace placeholder IDs with real subcategory and brand IDs
        products = products.map((product) => {
          // Replace subcategory placeholders
          if (product.subCategory && Array.isArray(product.subCategory)) {
            product.subCategory = product.subCategory
              .map((subcatPlaceholder) => {
                const subcatName = subcatPlaceholder
                  .replace("_ID_PLACEHOLDER", "")
                  .replace(/[\[\]'\s]/g, "")
                  .toLowerCase();

                const subcategory = subcategories.find(
                  (sc) =>
                    sc.slug.toLowerCase().includes(subcatName) ||
                    sc.name.toLowerCase().includes(subcatName)
                );

                return subcategory ? subcategory._id : null;
              })
              .filter((id) => id !== null);
          }

          // Replace brand placeholders
          if (
            product.brand &&
            typeof product.brand === "string" &&
            product.brand.includes("_ID_PLACEHOLDER")
          ) {
            const brandName = product.brand
              .replace("_ID_PLACEHOLDER", "")
              .toLowerCase();

            const brand = brands.find(
              (b) =>
                b.slug.toLowerCase() === brandName ||
                b.name.toLowerCase() === brandName
            );

            if (brand) {
              product.brand = brand._id;
            }
          }

          return product;
        });

        const insertedProducts = await Product.create(products);
        console.log(`${insertedProducts.length} Products inserted`.green);
      }
    }

    console.log("All Data Inserted Successfully".green.inverse);
    process.exit();
  } catch (error) {
    console.log("Error during data insertion:".red);
    console.log(error);
    process.exit(1);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    // Clear console
    console.clear();
    console.log("Starting data deletion...".yellow);

    // Check which collections to clear
    const collections = process.argv.slice(3) || ["all"];
    const clearAll = collections.includes("all");

    // Delete products
    if (clearAll || collections.includes("products")) {
      console.log("Deleting products...".cyan);
      await Product.deleteMany();
      console.log("Products deleted".red);
    }

    // Delete subcategories
    if (clearAll || collections.includes("subcategories")) {
      console.log("Deleting subcategories...".cyan);
      await SubCategory.deleteMany();
      console.log("Subcategories deleted".red);
    }

    // Delete brands
    if (clearAll || collections.includes("brands")) {
      console.log("Deleting brands...".cyan);
      await Brand.deleteMany();
      console.log("Brands deleted".red);
    }

    // Delete categories
    if (clearAll || collections.includes("categories")) {
      console.log("Deleting categories...".cyan);
      await Category.deleteMany();
      console.log("Categories deleted".red);
    }

    console.log("All Data Destroyed Successfully".red.inverse);
    process.exit();
  } catch (error) {
    console.log("Error during data deletion:".red);
    console.log(error);
    process.exit(1);
  }
};

// Display help information
const displayHelp = () => {
  console.log(
    `
  Souq.com Data Seeder
  ====================
  
  Usage:
    node seeder.js [command] [collections]
  
  Commands:
    -i, --import     Import data to database
    -d, --destroy    Delete data from database
    -h, --help       Display this help message
  
  Collections (optional):
    all              All collections (default)
    categories       Only categories
    subcategories    Only subcategories
    brands           Only brands
    products         Only products
  
  Examples:
    node seeder.js -i                  Import all collections
    node seeder.js -i categories       Import only categories
    node seeder.js -d products         Delete only products
    node seeder.js -i categories brands Import categories and brands
  `.cyan
  );
  process.exit();
};

// Process command line arguments
const arg = process.argv[2];

if (arg === "-i" || arg === "--import") {
  insertData();
} else if (arg === "-d" || arg === "--destroy") {
  destroyData();
} else if (arg === "-h" || arg === "--help") {
  displayHelp();
} else {
  console.log(`Invalid command. Use -h or --help for usage information.`.red);
  process.exit(1);
}
