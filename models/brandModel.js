const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = Schema(
  {
    name: {
      type: String,
      maxLength: [32, "Brand name cannot exceed 32 characters"],
      minLength: [3, "Brand name must be at least 3 characters"],
      required: [true, "Brand name is required"],
      unique: [true, "Brand name already exists"],
    },
    slug: {
      type: String,
      maxLength: [32, "Brand name cannot exceed 32 characters"],
      minLength: [3, "Brand name must be at least 3 characters"],
      required: [true, "Brand name is required"],
      unique: [true, "Brand name already exists"],
    },
    image: String,
  },
  {
    timestamps: true,
  }
);
//                                 when i do ref i use 'Brand'
const brandModel = mongoose.model("Brand", brandSchema);
module.exports = brandModel;
