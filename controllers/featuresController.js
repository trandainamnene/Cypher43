const featuresService = require('../services/featuresService');

exports.getAllFeatures = async (req, res) => {
    try {
        const result = await featuresService.getAllFeatures(req.query);
        res.status(200).json({
            success: true,
            data: result.features,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getFeatureById = async (req, res) => {
    try {
        const feature = await featuresService.getFeatureById(req.params.id);
        res.status(200).json({
            success: true,
            data: feature
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.createFeature = async (req, res) => {
    try {
        const feature = await featuresService.createFeature(req.body);
        res.status(201).json({
            success: true,
            data: feature,
            message: 'Feature created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateFeature = async (req, res) => {
    try {
        const feature = await featuresService.updateFeature(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: feature,
            message: 'Feature updated successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteFeature = async (req, res) => {
    try {
        await featuresService.deleteFeature(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Feature deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

