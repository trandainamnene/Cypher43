const Settings = require('../models/Settings');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private (Admin only)
exports.updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        // Update fields
        if (req.body.siteName) settings.siteName = req.body.siteName;
        if (req.body.pageTitle) settings.pageTitle = req.body.pageTitle;
        if (req.body.logoUrl) settings.logoUrl = req.body.logoUrl;
        if (req.body.footerDescription) settings.footerDescription = req.body.footerDescription;
        if (req.body.footerCopyright) settings.footerCopyright = req.body.footerCopyright;

        if (req.body.socialLinks) {
            settings.socialLinks = { ...settings.socialLinks, ...req.body.socialLinks };
        }

        if (req.body.footerLinks) {
            settings.footerLinks = { ...settings.footerLinks, ...req.body.footerLinks };
        }

        if (req.body.pricing) {
            settings.pricing = { ...settings.pricing, ...req.body.pricing };
        }

        const updatedSettings = await settings.save();

        res.status(200).json({
            success: true,
            data: updatedSettings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
