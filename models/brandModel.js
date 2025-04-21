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

const processImageURL = (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/brand/${doc.image}`;
  }
};

brandSchema.post("init", (doc) => {
  processImageURL(doc);
});

brandSchema.post("save", (doc) => {
  processImageURL(doc);
});

const brandModel = mongoose.model("Brand", brandSchema);
module.exports = brandModel;
