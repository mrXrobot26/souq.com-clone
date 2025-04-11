const { default: slugify } = require("slugify");
const Brand = require("../../models/brandModel");
const APIError = require("../../utils/APIError");

const createBrand = async (nameFromController) => {
  if (!nameFromController) return new APIError("msg", 400);
  const brandToDb = await Brand.create({
    name: nameFromController,
    slug: slugify(nameFromController),
  });
  if (!brandToDb) return new APIError("msg", 400);
  return {
    status: true,
    brand: brandToDb,
  };
};



module.exports = {
    createBrand
}
