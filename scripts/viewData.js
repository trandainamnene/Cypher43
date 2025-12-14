require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import tất cả models
const User = require('../models/User');
const Product = require('../models/Product');
const Powerful = require('../models/Powerful');
const Features = require('../models/Features');
const Benefit = require('../models/Benefit');
const FreeTool = require('../models/Freetool');
const HungtingTier = require('../models/HungtingTier');

// Hàm xem dữ liệu
const viewData = async () => {
    try {
        // Kết nối database
        await connectDB();
        console.log('✅ Đã kết nối MongoDB\n');

        // Đếm số lượng documents
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const powerfulCount = await Powerful.countDocuments();
        const featuresCount = await Features.countDocuments();
        const benefitCount = await Benefit.countDocuments();
        const freeToolCount = await FreeTool.countDocuments();
        const hungtingTierCount = await HungtingTier.countDocuments();

        console.log('📊 Số lượng documents trong mỗi collection:');
        console.log(`   - Users: ${userCount}`);
        console.log(`   - Products: ${productCount}`);
        console.log(`   - Powerful: ${powerfulCount}`);
        console.log(`   - Features: ${featuresCount}`);
        console.log(`   - Benefits: ${benefitCount}`);
        console.log(`   - FreeTools: ${freeToolCount}`);
        console.log(`   - HungtingTiers: ${hungtingTierCount}\n`);

        // Hiển thị một vài ví dụ
        if (userCount > 0) {
            console.log('👤 Sample Users:');
            const users = await User.find().select('username role createdAt').limit(3);
            users.forEach(user => {
                console.log(`   - ${user.username} (${user.role})`);
            });
            console.log();
        }

        if (productCount > 0) {
            console.log('📦 Sample Products:');
            const products = await Product.find().select('id name price status').limit(3);
            products.forEach(product => {
                console.log(`   - [${product.id}] ${product.name} - $${product.price} (${product.status})`);
            });
            console.log();
        }

        if (hungtingTierCount > 0) {
            console.log('🏆 Sample HungtingTiers:');
            const tiers = await HungtingTier.find().select('id name price').limit(3);
            tiers.forEach(tier => {
                console.log(`   - [${tier.id}] ${tier.name} - $${tier.price}`);
            });
            console.log();
        }

        // Đóng kết nối
        await mongoose.connection.close();
        console.log('✅ Đã đóng kết nối MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Lỗi khi xem dữ liệu:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Chạy
viewData();

