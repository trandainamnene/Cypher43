const Tool = require('../models/Tool');

const getAllTools = async (query = {}) => {
    try {
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const tool = await Tool.find()
            .sort('-id')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Tool.countDocuments();

        return {
            tool,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw error;
    }
};

const getTopTool = async (query) => {
    const { qty, type } = query;
    try {
        const tool = await Tool.find().sort('id').limit(qty).where({ type: type });
        if (!tool) {
            throw new Error('FreeTool not found');
        }
        return tool;
    } catch (error) {
        throw error;
    }
}


const getToolById = async (id) => {
    try {
        const tool = await Tool.findOne({ id: parseInt(id) });
        if (!tool) {
            throw new Error('FreeTool not found');
        }
        return tool;
    } catch (error) {
        throw error;
    }
};

const createTool = async (toolData) => {
    try {
        const lastTool = await Tool.findOne().sort('-id');
        const newId = lastTool ? lastTool.id + 1 : 1;

        const tool = await Tool.create({
            ...toolData,
            id: newId
        });

        return tool;
    } catch (error) {
        throw error;
    }
};

const updateTool = async (id, updateData) => {
    try {
        const tool = await Tool.findOneAndUpdate(
            { id: parseInt(id) },
            updateData,
            { new: true, runValidators: true }
        );

        if (!tool) {
            throw new Error('FreeTool not found');
        }

        return tool;
    } catch (error) {
        throw error;
    }
};

const deleteTool = async (id) => {
    try {
        const freeTool = await Tool.findOneAndDelete({ id: parseInt(id) });

        if (!freeTool) {
            throw new Error('Tool not found');
        }

        return freeTool;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllTools,
    getToolById,
    createTool,
    updateTool,
    deleteTool,
    getTopTool
};

