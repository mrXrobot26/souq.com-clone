const AsyncHandler = require("express-async-handler");
const {
  getSpacificSubCategory,
} = require("../services/controllerServices/subCategoryService");

const getSpacificSubCategoryController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const SpacificSubCategory = await getSpacificSubCategory(id);
  return res.status(200).json({
    status: "success",
    data: SpacificSubCategory.data,
  });
});

module.exports = {
  getSpacificSubCategoryController,
};
