const User = require('../models/User');
const News = require('../models/News');

exports.getDashboardStats = async (query) => {
    const { startDate, endDate } = query;

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
    // In real app, this should sum actual Payment records
    const monthlyRevenue = premiumUsers * 49;

    // Get news count
    const totalNews = await News.countDocuments();

    return {
        totalUsers,
        newRegistrations,
        premiumUsers,
        monthlyRevenue: monthlyRevenue,
        totalNews
    };
};
