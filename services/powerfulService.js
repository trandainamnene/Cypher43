const Powerful = require('../models/Powerful');

const getAllPowerfuls = async (query = {}) => {
    try {
        const { isPrivate, page = 1, limit = 10 } = query;
        const filter = {};
        
        if (isPrivate !== undefined) {
            filter.isPrivate = isPrivate === 'true';
        }

        const skip = (page - 1) * limit;
        
        const powerfuls = await Powerful.find(filter)
            .sort('-id')
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Powerful.countDocuments(filter);
        
        return {
            powerfuls,
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

const getPowerfulById = async (id) => {
    try {
        const powerful = await Powerful.findOne({ id: parseInt(id) });
        if (!powerful) {
            throw new Error('Powerful not found');
        }
        return powerful;
    } catch (error) {
        throw error;
    }
};

const createPowerful = async (powerfulData) => {
    try {
        const lastPowerful = await Powerful.findOne().sort('-id');
        const newId = lastPowerful ? lastPowerful.id + 1 : 1;
        
        const powerful = await Powerful.create({
            ...powerfulData,
            id: newId
        });
        
        return powerful;
    } catch (error) {
        throw error;
    }
};

const updatePowerful = async (id, updateData) => {
    try {
        const powerful = await Powerful.findOneAndUpdate(
            { id: parseInt(id) },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!powerful) {
            throw new Error('Powerful not found');
        }
        
        return powerful;
    } catch (error) {
        throw error;
    }
};

const deletePowerful = async (id) => {
    try {
        const powerful = await Powerful.findOneAndDelete({ id: parseInt(id) });
        
        if (!powerful) {
            throw new Error('Powerful not found');
        }
        
        return powerful;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllPowerfuls,
    getPowerfulById,
    createPowerful,
    updatePowerful,
    deletePowerful
};

