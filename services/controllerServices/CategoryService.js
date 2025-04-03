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
            message: 'An error occurred',
            error: error.message
        };
    }
};

const getCategories = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const categoriesFromDb = await Category.find({}).skip(skip).limit(limit);
        return {
            success: true,
            results : categoriesFromDb.length,
            data: categoriesFromDb
        };
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred',
            error: error.message
        };
    }
};

const createCategory = async (nameFromController) => {
    try {
        const categoryToDb = await Category.create({
            name: nameFromController,
            slag: slugify(nameFromController)
        });
        return {
            success: true,
            data: categoryToDb
        };
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred',
            error: error.message
        };
    }
};
const updateCategory = async (idFromController, nameFromController) => {
    try {
        const categoryFromDb = await Category.findOneAndUpdate(
            { _id: idFromController },
            { name: nameFromController, slag: slugify(nameFromController) },
            { new: true }
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
            message: 'An error occurred',
            error: error.message
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
            message: 'An error occurred',
            error: error.message
        };
    }
};





module.exports = {
    getCategoryById,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategoryById
}

