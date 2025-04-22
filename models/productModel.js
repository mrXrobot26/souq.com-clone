const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [100, "Title cannot exceed 100 characters"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: [true, "Product slug is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minLength: [30, "Description must be at least 30 characters"],
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
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product cover image is required"],
    },
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const processImageURL = (doc) => {
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/products/imageCover/${doc.imageCover}`;
  }
  if (doc.images) {
    doc.images = doc.images.map(
      (img) => `${process.env.BASE_URL}/products/productimage/${img}`
    );
  }
};
productSchema.post("init", (doc) => {
  processImageURL(doc);
});
productSchema.post("save", (doc) => {
  processImageURL(doc);
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
