const Product = require('../models/Product');

// Lấy tất cả products
const getAllProducts = async (query = {}) => {
    try {
        const { status, page = 1, limit = 10, sort = '-createdAt' } = query;
        const filter = {};

        if (status) {
            filter.status = status;
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(filter);

        return {
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw error;
    }
};

// Lấy product theo ID
const getProductById = async (id) => {
    try {
        const product = await Product.findOne({ id: parseInt(id) });
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch (error) {
        throw error;
    }
};

// Tạo product mới
const createProduct = async (productData) => {
    console.log(productData);
    try {
        // Tự động tăng id
        const lastProduct = await Product.findOne().sort('-id');
        const newId = lastProduct ? lastProduct.id + 1 : 1;

        const product = await Product.create({
            ...productData,
            id: newId
        });

        return product;
    } catch (error) {
        console.log(error)
        throw error;
    }
};

// Cập nhật product
const updateProduct = async (id, updateData) => {
    try {
        const product = await Product.findOneAndUpdate(
            { id: parseInt(id) },
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    } catch (error) {
        throw error;
    }
};

// Xóa product
const deleteProduct = async (id) => {
    try {
        const product = await Product.findOneAndDelete({ id: parseInt(id) });

        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

