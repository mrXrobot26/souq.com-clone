const Category = require('../../models/categoryModel');
const slugify = require('slugify');
const APIError = require('../../utils/APIError');

const getCategoryById = async (id) => {
    try {
        const categoryFromDb = await Category.findById(id);
        if (!categoryFromDb) {
            throw new APIError('Category not found', 404);
        }

        return {
            data: categoryFromDb
        };
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError(error.message, 500);
    }
};

const getCategories = async (page = 1, limit = 10) => {
    try {
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
    } catch (error) {
        throw new APIError(error.message, 500);
    }
};

const createCategory = async (nameFromController) => {
    try {
        if (!nameFromController) {
            throw new APIError('Category name is required', 400);
        }

        const categoryToDb = await Category.create({
            name: nameFromController,
            slug: slugify(nameFromController) 
        });
        
        return {
            data: categoryToDb
        };
    } catch (error) {
        if (error.code === 11000) {
            throw new APIError('Category with this name already exists', 400);
        }
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError(error.message, 500);
    }
};

const updateCategory = async (idFromController, nameFromController) => {
    try {
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

        return {
            data: categoryFromDb
        };
    } catch (error) {
        if (error.code === 11000) {
            throw new APIError('Category with this name already exists', 400);
        }
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError(error.message, 500);
    }
};

const deleteCategoryById = async (idFromController) => {
    try {
        const categoryFromDb = await Category.findByIdAndDelete(idFromController);

        if (!categoryFromDb) {
            throw new APIError('Category not found', 404);
        }

        return {
            message: 'Category deleted successfully'
        };
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError(error.message, 500);
    }
};

module.exports = {
    getCategoryById,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategoryById
};