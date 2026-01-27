const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/track', protect, userController.trackProduct);
router.get('/profile', protect, userController.getUserProfile);
router.delete('/track/:productId', protect, userController.untrackProduct);
router.get('/tracked', protect, userController.getTrackedProducts);
router.get('/', protect, admin, userController.getAllUsers);
router.put('/:id/status', protect, admin, userController.updateUserAccountType);

module.exports = router;
