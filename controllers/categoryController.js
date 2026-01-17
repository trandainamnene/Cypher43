const categoryService = require('../services/categoryService');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories(req.query);
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
