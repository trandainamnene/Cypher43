const benefitService = require('../services/benefitService');

exports.getAllBenefits = async (req, res) => {
    try {
        const result = await benefitService.getAllBenefits(req.query);
        res.status(200).json({
            success: true,
            data: result.benefits,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getBenefitById = async (req, res) => {
    try {
        const benefit = await benefitService.getBenefitById(req.params.id);
        res.status(200).json({
            success: true,
            data: benefit
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.createBenefit = async (req, res) => {
    try {
        const benefit = await benefitService.createBenefit(req.body);
        res.status(201).json({
            success: true,
            data: benefit,
            message: 'Benefit created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateBenefit = async (req, res) => {
    try {
        const benefit = await benefitService.updateBenefit(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: benefit,
            message: 'Benefit updated successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteBenefit = async (req, res) => {
    try {
        await benefitService.deleteBenefit(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Benefit deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

