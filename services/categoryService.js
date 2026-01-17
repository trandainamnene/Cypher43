const Category = require('../models/Category');

const getAllCategories = async (query = {}) => {
    return await Category.find(query);
};

const createCategory = async (data) => {
    // Basic ID auto-increment simulation
    const last = await Category.findOne().sort({ id: -1 });
    const id = last ? last.id + 1 : 1;

    return await Category.create({
        ...data,
        id
    });
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory: async (id, data) => {
        // Get the old category to check if name changed
        const oldCategory = await Category.findById(id);
        if (!oldCategory) return null;

        // Update the category
        const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true });

        // If the category name changed and it's a news category, update all related news
        if (oldCategory.name !== data.name && oldCategory.type === 'news') {
            const News = require('../models/News');
            await News.updateMany(
                { category: oldCategory.name },
                { category: data.name }
            );
        }

        return updatedCategory;
    },
    deleteCategory: async (id) => {
        return await Category.findByIdAndDelete(id);
    }
};
