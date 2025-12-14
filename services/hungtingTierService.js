const HungtingTier = require('../models/HungtingTier');

const getAllHungtingTiers = async (query = {}) => {
    try {
        const { page = 1, limit = 10, sort = 'price' } = query;
        const skip = (page - 1) * limit;
        
        const hungtingTiers = await HungtingTier.find()
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await HungtingTier.countDocuments();
        
        return {
            hungtingTiers,
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

const getHungtingTierById = async (id) => {
    try {
        const hungtingTier = await HungtingTier.findOne({ id: parseInt(id) });
        if (!hungtingTier) {
            throw new Error('HungtingTier not found');
        }
        return hungtingTier;
    } catch (error) {
        throw error;
    }
};

const createHungtingTier = async (hungtingTierData) => {
    try {
        const lastHungtingTier = await HungtingTier.findOne().sort('-id');
        const newId = lastHungtingTier ? lastHungtingTier.id + 1 : 1;
        
        const hungtingTier = await HungtingTier.create({
            ...hungtingTierData,
            id: newId
        });
        
        return hungtingTier;
    } catch (error) {
        throw error;
    }
};

const updateHungtingTier = async (id, updateData) => {
    try {
        const hungtingTier = await HungtingTier.findOneAndUpdate(
            { id: parseInt(id) },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!hungtingTier) {
            throw new Error('HungtingTier not found');
        }
        
        return hungtingTier;
    } catch (error) {
        throw error;
    }
};

const deleteHungtingTier = async (id) => {
    try {
        const hungtingTier = await HungtingTier.findOneAndDelete({ id: parseInt(id) });
        
        if (!hungtingTier) {
            throw new Error('HungtingTier not found');
        }
        
        return hungtingTier;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllHungtingTiers,
    getHungtingTierById,
    createHungtingTier,
    updateHungtingTier,
    deleteHungtingTier
};

