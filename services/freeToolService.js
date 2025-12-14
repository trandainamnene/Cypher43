const FreeTool = require('../models/Freetool');

const getAllFreeTools = async (query = {}) => {
    try {
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        
        const freeTools = await FreeTool.find()
            .sort('-id')
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await FreeTool.countDocuments();
        
        return {
            freeTools,
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

const getFreeToolById = async (id) => {
    try {
        const freeTool = await FreeTool.findOne({ id: parseInt(id) });
        if (!freeTool) {
            throw new Error('FreeTool not found');
        }
        return freeTool;
    } catch (error) {
        throw error;
    }
};

const createFreeTool = async (freeToolData) => {
    try {
        const lastFreeTool = await FreeTool.findOne().sort('-id');
        const newId = lastFreeTool ? lastFreeTool.id + 1 : 1;
        
        const freeTool = await FreeTool.create({
            ...freeToolData,
            id: newId
        });
        
        return freeTool;
    } catch (error) {
        throw error;
    }
};

const updateFreeTool = async (id, updateData) => {
    try {
        const freeTool = await FreeTool.findOneAndUpdate(
            { id: parseInt(id) },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!freeTool) {
            throw new Error('FreeTool not found');
        }
        
        return freeTool;
    } catch (error) {
        throw error;
    }
};

const deleteFreeTool = async (id) => {
    try {
        const freeTool = await FreeTool.findOneAndDelete({ id: parseInt(id) });
        
        if (!freeTool) {
            throw new Error('FreeTool not found');
        }
        
        return freeTool;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllFreeTools,
    getFreeToolById,
    createFreeTool,
    updateFreeTool,
    deleteFreeTool
};

