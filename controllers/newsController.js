const News = require('../models/News');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res) => {
    try {
        const { category, isTrending, limit, search, page: pageQuery, sort, timeRange, tag, include_hidden } = req.query;
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

        res.status(200).json({
            success: true,
            count: formattedResults.length,
            total,
            page,
            pages: Math.ceil(total / pageSize),
            data: formattedResults
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        // Increment views
        news.views += 1;
        await news.save();

        const newsObj = news.toObject();
        res.status(200).json({
            success: true,
            data: {
                ...newsObj,
                date: new Date(news.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Create new news
// @route   POST /api/news
// @access  Private (Admin only)
exports.createNews = async (req, res) => {
    try {
        const news = await News.create(req.body);

        res.status(201).json({
            success: true,
            data: news
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server Error'
            });
        }
    }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private (Admin only)
exports.updateNews = async (req, res) => {
    try {
        let news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        news = await News.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private (Admin only)
exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        await news.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get top used tags
// @route   GET /api/news/tags
// @access  Public
exports.getTopTags = async (req, res) => {
    try {
        const tags = await News.aggregate([
            { $match: { status: 'published' } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, tag: '$_id' } }
        ]);

        const tagList = tags.map(t => t.tag);

        res.status(200).json({
            success: true,
            data: tagList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
