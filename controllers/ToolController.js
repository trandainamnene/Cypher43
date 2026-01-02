const freeToolService = require('../services/toolService');

exports.getAllTools = async (req, res) => {
    try {
        const result = await freeToolService.getAllTools(req.query);
        console.dir(`result : ${result.freeTools}`)
        res.status(200).json({
            success: true,
            data: result.tool,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getTopTool = async (req, res) => {
    try {
        const result = await freeToolService.getTopTool(req.query);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.getToolById = async (req, res) => {
    try {
        const freeTool = await freeToolService.getToolById(req.params.id);
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

exports.createTool = async (req, res) => {
    try {
        const freeTool = await freeToolService.createTool(req.body);
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

exports.updateTool = async (req, res) => {
    try {
        const freeTool = await freeToolService.updateTool(req.params.id, req.body);
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

exports.deleteTool = async (req, res) => {
    try {
        await freeToolService.deleteTool(req.params.id);
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

