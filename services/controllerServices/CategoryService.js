const Category = require('../../models/categoryModel');
const slugify = require('slugify');

const getCategoryById = async (id) => {
    try {
        const categoryFromDb = await Category.findById(id);
        if (!categoryFromDb) {
            return {
                success: false,
                message: 'Category not found'
            };
        }

        return {
            success: true,
            data: categoryFromDb
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

const getCategories = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const count = await Category.countDocuments();
        const categoriesFromDb = await Category.find({}).skip(skip).limit(limit);
        
        return {
            success: true,
            results: categoriesFromDb.length,
            totalCount: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: categoriesFromDb
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

const createCategory = async (nameFromController) => {
    try {
        if (!nameFromController) {
            return {
                success: false,
                message: 'Category name is required'
            };
        }

        const categoryToDb = await Category.create({
            name: nameFromController,
            slug: slugify(nameFromController) 
        });
        
        return {
            success: true,
            data: categoryToDb
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

const updateCategory = async (idFromController, nameFromController) => {
    try {
        if (!nameFromController) {
            return {
                success: false,
                message: 'Category name is required'
            };
        }

        const categoryFromDb = await Category.findOneAndUpdate(
            { _id: idFromController },
            { name: nameFromController, slug: slugify(nameFromController) }, // Fixed 'slag' to 'slug'
            { new: true, runValidators: true }
        );

        if (!categoryFromDb) {
            return {
                success: false,
                message: 'Category not found'
            };
        }

        return {
            success: true,
            data: categoryFromDb
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

const deleteCategoryById = async (idFromController) => {
    try {
        const categoryFromDb = await Category.findByIdAndDelete(idFromController);

        if (!categoryFromDb) {
            return {
                success: false,
                message: 'Category not found'
            };
        }

        return {
            success: true,
            message: 'Category deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = {
    getCategoryById,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategoryById
};