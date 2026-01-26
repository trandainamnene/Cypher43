const newsService = require('../services/newsService');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res) => {
    try {
        const result = await newsService.getAllNews(req.query);
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = async (req, res) => {
    try {
        const result = await newsService.getNewsById(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Create new news
// @route   POST /api/news
// @access  Private (Admin only)
exports.createNews = async (req, res) => {
    try {
        const news = await newsService.createNews(req.body);

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
                message: 'Server Error',
                error: error.message
            });
        }
    }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private (Admin only)
exports.updateNews = async (req, res) => {
    try {
        const news = await newsService.updateNews(req.params.id, req.body);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private (Admin only)
exports.deleteNews = async (req, res) => {
    try {
        const isDeleted = await newsService.deleteNews(req.params.id);

        if (!isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get top used tags
// @route   GET /api/news/tags
// @access  Public
exports.getTopTags = async (req, res) => {
    try {
        const tagList = await newsService.getTopTags();

        res.status(200).json({
            success: true,
            data: tagList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
