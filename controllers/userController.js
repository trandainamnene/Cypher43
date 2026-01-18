const User = require('../models/User');

// Track a product
exports.trackProduct = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already tracked
        if (user.trackedProducts.includes(productId)) {
            return res.status(400).json({ message: 'Product already tracked' });
        }

        user.trackedProducts.push(productId);
        await user.save();

        res.status(200).json({
            message: 'Product tracked successfully',
            trackedProducts: user.trackedProducts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Untrack a product
exports.untrackProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.trackedProducts = user.trackedProducts.filter(
            (id) => id.toString() !== productId
        );

        await user.save();

        res.status(200).json({
            message: 'Product untracked successfully',
            trackedProducts: user.trackedProducts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get tracked products
exports.getTrackedProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('trackedProducts');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user.trackedProducts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Get all users (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            query = {
                $or: [
                    { username: searchRegex },
                    { email: searchRegex },
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { phoneNumber: searchRegex }
                ]
            };
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user account type (Admin)
exports.updateUserAccountType = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountType } = req.body;

        if (!['basic', 'premium'].includes(accountType)) {
            return res.status(400).json({ message: 'Invalid account type' });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { accountType },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User account type updated',
            data: user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
