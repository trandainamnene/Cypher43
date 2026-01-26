const dashboardService = require('../services/dashboardService');

// Get dashboard statistics (Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await dashboardService.getDashboardStats(req.query);

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
