const Features = require('../models/Features');

const getAllFeatures = async (query = {}) => {
    try {
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        
        const features = await Features.find()
            .sort('-id')
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Features.countDocuments();
        
        return {
            features,
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

const getFeatureById = async (id) => {
    try {
        const feature = await Features.findOne({ id: parseInt(id) });
        if (!feature) {
            throw new Error('Feature not found');
        }
        return feature;
    } catch (error) {
        throw error;
    }
};

const createFeature = async (featureData) => {
    try {
        const lastFeature = await Features.findOne().sort('-id');
        const newId = lastFeature ? lastFeature.id + 1 : 1;
        
        const feature = await Features.create({
            ...featureData,
            id: newId
        });
        
        return feature;
    } catch (error) {
        throw error;
    }
};

const updateFeature = async (id, updateData) => {
    try {
        const feature = await Features.findOneAndUpdate(
            { id: parseInt(id) },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!feature) {
            throw new Error('Feature not found');
        }
        
        return feature;
    } catch (error) {
        throw error;
    }
};

const deleteFeature = async (id) => {
    try {
        const feature = await Features.findOneAndDelete({ id: parseInt(id) });
        
        if (!feature) {
            throw new Error('Feature not found');
        }
        
        return feature;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllFeatures,
    getFeatureById,
    createFeature,
    updateFeature,
    deleteFeature
};

