const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Lấy tất cả products
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Lấy product theo ID
router.get('/:id', productController.getProductById);

// POST /api/products - Tạo product mới
router.post('/', productController.createProduct);

// PUT /api/products/:id - Cập nhật product
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Xóa product
router.delete('/:id', productController.deleteProduct);

module.exports = router;

