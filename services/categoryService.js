const Category = require('../models/Category');

const getAllCategories = async () => {
    return await Category.find();
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
        return await Category.findByIdAndUpdate(id, data, { new: true });
    },
    deleteCategory: async (id) => {
        return await Category.findByIdAndDelete(id);
    }
};
