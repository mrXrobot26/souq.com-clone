const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//schema
const CategorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name Required"],
      minLength: [3, "Min Length of Category Must be 3"],
      maxLength: [32, "Max Length of Category Must be 32"],
      unique: [true, "Category name must be unique"],
    },
    // Category Name A and B => a-and-b this is Slug
    slug: {
      type: String, // Missing type was causing the error
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

const processImageURL = (doc) => {
  if (doc.image) {
    //http://localhost:7000/category/category-622b09f2-2229-4ef9-b9be-d80fb1d24fb0-1745179752711.jpeg
    doc.image = `${process.env.BASE_URL}/category/${doc.image}`;
  }
};

CategorySchema.post("init", (doc) => {
  processImageURL(doc);
});

CategorySchema.post("save", (doc) => {
  processImageURL(doc);
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
