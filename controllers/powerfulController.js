const powerfulService = require('../services/powerfulService');

exports.getAllPowerfuls = async (req, res) => {
    try {
        const result = await powerfulService.getAllPowerfuls(req.query);
        res.status(200).json({
            success: true,
            data: result.powerfuls,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPowerfulById = async (req, res) => {
    try {
        const powerful = await powerfulService.getPowerfulById(req.params.id);
        res.status(200).json({
            success: true,
            data: powerful
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.createPowerful = async (req, res) => {
    try {
        const powerful = await powerfulService.createPowerful(req.body);
        res.status(201).json({
            success: true,
            data: powerful,
            message: 'Powerful created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updatePowerful = async (req, res) => {
    try {
        const powerful = await powerfulService.updatePowerful(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: powerful,
            message: 'Powerful updated successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.deletePowerful = async (req, res) => {
    try {
        await powerfulService.deletePowerful(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Powerful deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

