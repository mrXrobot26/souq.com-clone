const CategoryModel = require('../models/categoryModel')
const AddCategory = async (req, res) => {
    try {
        const nameFromReq = req.body.name;
        const newCategory = new CategoryModel({ name: nameFromReq });
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        console.error("Error saving category:", err);
        res.status(500).json({ error: "Failed to save category" });
    }
};

module.exports = AddCategory;