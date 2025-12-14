const freeToolService = require('../services/freeToolService');

exports.getAllFreeTools = async (req, res) => {
    try {
        const result = await freeToolService.getAllFreeTools(req.query);
        res.status(200).json({
            success: true,
            data: result.freeTools,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getFreeToolById = async (req, res) => {
    try {
        const freeTool = await freeToolService.getFreeToolById(req.params.id);
        res.status(200).json({
            success: true,
            data: freeTool
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.createFreeTool = async (req, res) => {
    try {
        const freeTool = await freeToolService.createFreeTool(req.body);
        res.status(201).json({
            success: true,
            data: freeTool,
            message: 'FreeTool created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateFreeTool = async (req, res) => {
    try {
        const freeTool = await freeToolService.updateFreeTool(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: freeTool,
            message: 'FreeTool updated successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteFreeTool = async (req, res) => {
    try {
        await freeToolService.deleteFreeTool(req.params.id);
        res.status(200).json({
            success: true,
            message: 'FreeTool deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

