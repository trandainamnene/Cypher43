const hungtingTierService = require('../services/hungtingTierService');

exports.getAllHungtingTiers = async (req, res) => {
    try {
        const result = await hungtingTierService.getAllHungtingTiers(req.query);
        res.status(200).json({
            success: true,
            data: result.hungtingTiers,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getHungtingTierById = async (req, res) => {
    try {
        const hungtingTier = await hungtingTierService.getHungtingTierById(req.params.id);
        res.status(200).json({
            success: true,
            data: hungtingTier
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.createHungtingTier = async (req, res) => {
    try {
        const hungtingTier = await hungtingTierService.createHungtingTier(req.body);
        res.status(201).json({
            success: true,
            data: hungtingTier,
            message: 'HungtingTier created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateHungtingTier = async (req, res) => {
    try {
        const hungtingTier = await hungtingTierService.updateHungtingTier(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: hungtingTier,
            message: 'HungtingTier updated successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteHungtingTier = async (req, res) => {
    try {
        await hungtingTierService.deleteHungtingTier(req.params.id);
        res.status(200).json({
            success: true,
            message: 'HungtingTier deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

