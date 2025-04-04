const Category = require('../../models/categoryModel');
const slugify = require('slugify');
const APIError = require('../../utils/APIError');

const getCategoryById = async (id) => {
    const categoryFromDb = await Category.findById(id);
    if (!categoryFromDb) {
        throw new APIError('Category not found', 404);
    }

    return categoryFromDb;
};

const getCategories = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const count = await Category.countDocuments();
    const categoriesFromDb = await Category.find({}).skip(skip).limit(limit);
    
    return {
        results: categoriesFromDb.length,
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: categoriesFromDb
    };
};

const createCategory = async (nameFromController) => {
    if (!nameFromController) {
        throw new APIError('Category name is required', 400);
    }

    const categoryToDb = await Category.create({
        name: nameFromController,
        slug: slugify(nameFromController) 
    });
    
    return categoryToDb;
};

const updateCategory = async (idFromController, nameFromController) => {
    if (!nameFromController) {
        throw new APIError('Category name is required', 400);
    }

    const categoryFromDb = await Category.findOneAndUpdate(
        { _id: idFromController },
        { name: nameFromController, slug: slugify(nameFromController) },
        { new: true, runValidators: true }
    );

    if (!categoryFromDb) {
        throw new APIError('Category not found', 404);
    }

    return categoryFromDb;
};

const deleteCategoryById = async (idFromController) => {
    const categoryFromDb = await Category.findByIdAndDelete(idFromController);

    if (!categoryFromDb) {
        throw new APIError('Category not found', 404);
    }

    return true;
};

module.exports = {
    getCategoryById,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategoryById
};