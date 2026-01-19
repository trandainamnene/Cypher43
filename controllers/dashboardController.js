const User = require('../models/User');

// Get dashboard statistics (Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build date filter
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Total users
        const totalUsers = await User.countDocuments();

        // New registrations (within date range or last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUserFilter = dateFilter.createdAt ? dateFilter : {
            createdAt: { $gte: thirtyDaysAgo }
        };
        const newRegistrations = await User.countDocuments(newUserFilter);

        // Premium users
        const premiumUsers = await User.countDocuments({ accountType: 'premium' });

        // Revenue calculation (assuming $49/month per premium user)
        const monthlyRevenue = premiumUsers * 49;

        // Get news count
        const News = require('../models/News');
        const totalNews = await News.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                newRegistrations,
                premiumUsers,
                monthlyRevenue,
                totalNews
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
