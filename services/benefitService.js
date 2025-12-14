const Benefit = require('../models/Benefit');

const getAllBenefits = async (query = {}) => {
    try {
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        
        const benefits = await Benefit.find()
            .sort('-id')
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Benefit.countDocuments();
        
        return {
            benefits,
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

const getBenefitById = async (id) => {
    try {
        const benefit = await Benefit.findOne({ id: parseInt(id) });
        if (!benefit) {
            throw new Error('Benefit not found');
        }
        return benefit;
    } catch (error) {
        throw error;
    }
};

const createBenefit = async (benefitData) => {
    try {
        const lastBenefit = await Benefit.findOne().sort('-id');
        const newId = lastBenefit ? lastBenefit.id + 1 : 1;
        
        const benefit = await Benefit.create({
            ...benefitData,
            id: newId
        });
        
        return benefit;
    } catch (error) {
        throw error;
    }
};

const updateBenefit = async (id, updateData) => {
    try {
        const benefit = await Benefit.findOneAndUpdate(
            { id: parseInt(id) },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!benefit) {
            throw new Error('Benefit not found');
        }
        
        return benefit;
    } catch (error) {
        throw error;
    }
};

const deleteBenefit = async (id) => {
    try {
        const benefit = await Benefit.findOneAndDelete({ id: parseInt(id) });
        
        if (!benefit) {
            throw new Error('Benefit not found');
        }
        
        return benefit;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllBenefits,
    getBenefitById,
    createBenefit,
    updateBenefit,
    deleteBenefit
};

