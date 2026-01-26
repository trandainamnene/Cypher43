const News = require('../models/News');

/**
 * Get all news with filtering, sorting and pagination
 */
exports.getAllNews = async (queryParams) => {
    const { category, isTrending, limit, search, page: pageQuery, sort, timeRange, tag, include_hidden } = queryParams;
    let query = {};

    if (tag) {
        query.tags = tag;
    }

    if (category) {
        query.category = category;
    }

    if (isTrending) {
        query.isTrending = isTrending === 'true';
    }

    if (timeRange) {
        const now = new Date();
        let startDate;
        if (timeRange === 'today') {
            startDate = new Date(now.setHours(0, 0, 0, 0));
        } else if (timeRange === 'week') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (timeRange === 'month') {
            startDate = new Date(now.setMonth(now.getMonth() - 1));
        }
        if (startDate) {
            query.createdAt = { $gte: startDate };
        }
    }

    // Logic to combine Search and Visibility filters effectively
    let searchConditions = null;
    if (search) {
        if (search.trim().startsWith('#')) {
            const tagQuery = search.trim().substring(1);
            if (tagQuery) { // Avoid searching for empty string if user just types "#"
                searchConditions = [
                    { tags: { $regex: tagQuery, $options: 'i' } }
                ];
            }
        } else {
            searchConditions = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }
    }

    const visibilityConditions = include_hidden !== 'true' ? [
        { status: 'published' },
        { status: 'scheduled', publishedAt: { $lte: new Date() } }
    ] : null;

    if (searchConditions && visibilityConditions) {
        query.$and = [
            { $or: searchConditions },
            { $or: visibilityConditions }
        ];
    } else if (searchConditions) {
        query.$or = searchConditions;
    } else if (visibilityConditions) {
        query.$or = visibilityConditions;
    }

    let newsQuery = News.find(query);

    // Sorting
    if (sort === 'popular') {
        newsQuery = newsQuery.sort({ views: -1 });
    } else if (sort === 'oldest') {
        newsQuery = newsQuery.sort({ createdAt: 1 });
    } else {
        newsQuery = newsQuery.sort({ createdAt: -1 });
    }

    // Pagination
    const page = parseInt(pageQuery, 10) || 1;
    const pageSize = parseInt(limit, 10) || 100;
    const skip = (page - 1) * pageSize;

    newsQuery = newsQuery.skip(skip).limit(pageSize);

    const results = await newsQuery;
    const total = await News.countDocuments(query);

    const formattedResults = results.map(item => {
        const newsObj = item.toObject();
        return {
            ...newsObj,
            date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
    });

    return {
        count: formattedResults.length,
        total,
        page,
        pages: Math.ceil(total / pageSize),
        data: formattedResults
    };
};

/**
 * Get single news by ID
 */
exports.getNewsById = async (id) => {
    const news = await News.findById(id);

    if (!news) {
        return null;
    }

    // Increment views
    news.views += 1;
    await news.save();

    const newsObj = news.toObject();
    return {
        ...newsObj,
        date: new Date(news.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
};

/**
 * Create new news
 */
exports.createNews = async (newsData) => {
    return await News.create(newsData);
};

/**
 * Update news
 */
exports.updateNews = async (id, updateData) => {
    const news = await News.findById(id);

    if (!news) {
        return null;
    }

    return await News.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

/**
 * Delete news
 */
exports.deleteNews = async (id) => {
    const news = await News.findById(id);

    if (!news) {
        return false;
    }

    await news.deleteOne();
    return true;
};

/**
 * Get top tags
 */
exports.getTopTags = async () => {
    const tags = await News.aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, tag: '$_id' } }
    ]);

    return tags.map(t => t.tag);
};
