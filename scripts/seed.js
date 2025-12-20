require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');
// Import tất cả models
const User = require('../models/User');
const Product = require('../models/Product');
const Powerful = require('../models/Powerful');
const Features = require('../models/Features');
const Benefit = require('../models/Benefit');
const FreeTool = require('../models/Freetool');
const HungtingTier = require('../models/HungtingTier');

// Hàm seed dữ liệu
const seedData = async () => {
    try {
        // Kết nối database
        await connectDB();
        console.log('✅ Đã kết nối MongoDB');
        
        // Xóa dữ liệu cũ (optional - comment nếu muốn giữ lại)
        console.log('🗑️  Đang xóa dữ liệu cũ...');
        await User.deleteMany({});
        await Product.deleteMany({});
        await Powerful.deleteMany({});
        await Features.deleteMany({});
        await Benefit.deleteMany({});
        await FreeTool.deleteMany({});
        await HungtingTier.deleteMany({});
        console.log('✅ Đã xóa dữ liệu cũ');
        //
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin1sssss23', salt);
        console.log(`this password: ${hashedPassword}`);
        // Seed Users
        console.log('👤 Đang tạo Users...');
        const users = await User.insertMany([
            {
                username: 'admin',
                password: 'admin1sssss23', // Sẽ được hash tự động bởi pre-save hook
                role: 'admin'
            },
            {
                username: 'user1',
                password: 'user123',
                role: 'user'
            },
            {
                username: 'user2',
                password: 'user123',
                role: 'user'
            },
            {
                username: 'testuser',
                password: 'test123',
                role: 'user'
            }
        ]);
        console.log(`✅ Đã tạo ${users.length} users`);

        // Seed Products
        console.log('📦 Đang tạo Products...');
        const products = await Product.insertMany([
            {
                id: 1,
                status: 'active',
                feature: ['Fast Processing', 'Secure', 'Scalable'],
                name: 'Crypto Trading Bot',
                shortNamme: 'CTB',
                description: 'Advanced cryptocurrency trading bot with AI-powered analysis',
                keyRequirements: ['API Key', 'Minimum Balance: $100'],
                supportChian: ['Ethereum', 'Bitcoin', 'Binance Smart Chain'],
                price: 299.99,
                about: 'Professional trading bot for cryptocurrency markets',
                toltalRise: 50000,
                backers: 250,
                deadline: new Date('2024-12-31'),
                networkd: 'Ethereum',
                token: 'ETH',
                supportNetworks: ['Ethereum', 'BSC', 'Polygon']
            },
            {
                id: 2,
                status: 'active',
                feature: ['Real-time Monitoring', 'Multi-chain', 'Analytics'],
                name: 'DeFi Analytics Platform',
                shortNamme: 'DAP',
                description: 'Comprehensive DeFi analytics and portfolio tracking platform',
                keyRequirements: ['Wallet Connection', 'Browser Extension'],
                supportChian: ['Ethereum', 'Polygon', 'Arbitrum'],
                price: 199.99,
                about: 'Track and analyze your DeFi portfolio across multiple chains',
                toltalRise: 75000,
                backers: 380,
                deadline: new Date('2024-11-30'),
                networkd: 'Polygon',
                token: 'MATIC',
                supportNetworks: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism']
            },
            {
                id: 3,
                status: 'upcoming',
                feature: ['NFT Marketplace', 'Cross-chain', 'Low Fees'],
                name: 'NFT Marketplace Pro',
                shortNamme: 'NMP',
                description: 'Next-generation NFT marketplace with cross-chain support',
                keyRequirements: ['Wallet', 'KYC Verification'],
                supportChian: ['Ethereum', 'Solana', 'Polygon'],
                price: 149.99,
                about: 'Buy, sell, and trade NFTs across multiple blockchains',
                toltalRise: 30000,
                backers: 150,
                deadline: new Date('2025-01-15'),
                networkd: 'Ethereum',
                token: 'ETH',
                supportNetworks: ['Ethereum', 'Solana', 'Polygon', 'Avalanche']
            }
        ]);
        console.log(`✅ Đã tạo ${products.length} products`);

        // Seed Powerful
        console.log('⚡ Đang tạo Powerful...');
        const powerfuls = await Powerful.insertMany([
            {
                id: 1,
                name: 'Advanced Analytics',
                isPrivate: false,
                description: 'Powerful analytics tools for data analysis',
                features: ['Real-time Data', 'Custom Dashboards', 'Export Reports']
            },
            {
                id: 2,
                name: 'Enterprise Security',
                isPrivate: true,
                description: 'Enterprise-grade security features',
                features: ['2FA', 'Encryption', 'Audit Logs', 'Role-based Access']
            },
            {
                id: 3,
                name: 'API Integration',
                isPrivate: false,
                description: 'Comprehensive API for third-party integrations',
                features: ['REST API', 'Webhooks', 'GraphQL', 'Rate Limiting']
            }
        ]);
        console.log(`✅ Đã tạo ${powerfuls.length} powerful items`);

        // Seed Features
        console.log('🎯 Đang tạo Features...');
        const features = await Features.insertMany([
            {
                id: 1,
                name: 'User Management',
                includes: [
                    { name: 'Create User', value: true },
                    { name: 'Edit User', value: true },
                    { name: 'Delete User', value: false },
                    { name: 'Max Users', value: 100 }
                ]
            },
            {
                id: 2,
                name: 'Payment Processing',
                includes: [
                    { name: 'Credit Card', value: true },
                    { name: 'Crypto Payment', value: true },
                    { name: 'PayPal', value: false },
                    { name: 'Transaction Fee', value: '2.5%' }
                ]
            },
            {
                id: 3,
                name: 'Notification System',
                includes: [
                    { name: 'Email Notifications', value: true },
                    { name: 'SMS Notifications', value: false },
                    { name: 'Push Notifications', value: true },
                    { name: 'Custom Templates', value: true }
                ]
            }
        ]);
        console.log(`✅ Đã tạo ${features.length} features`);

        // Seed Benefits
        console.log('🎁 Đang tạo Benefits...');
        const benefits = await Benefit.insertMany([
            {
                id: 1,
                name: 'Premium Support',
                description: '24/7 premium customer support with priority response',
                features: ['Live Chat', 'Phone Support', 'Email Support', 'Dedicated Manager']
            },
            {
                id: 2,
                name: 'Early Access',
                description: 'Get early access to new features and updates',
                features: ['Beta Features', 'Feature Requests', 'Exclusive Updates']
            },
            {
                id: 3,
                name: 'Discount Program',
                description: 'Exclusive discounts on all products and services',
                features: ['20% Off', 'Seasonal Sales', 'Bundle Deals', 'Loyalty Rewards']
            }
        ]);
        console.log(`✅ Đã tạo ${benefits.length} benefits`);

        // Seed FreeTool
        console.log('🆓 Đang tạo FreeTools...');
        const freeTools = await FreeTool.insertMany([
            {
                id: 1,
                name: 'Portfolio Tracker',
                description: 'Free portfolio tracking tool for cryptocurrency',
                features: ['Real-time Prices', 'Portfolio Value', 'Profit/Loss'],
                idUser: [1, 2] // User IDs
            },
            {
                id: 2,
                name: 'Price Alert',
                description: 'Set price alerts for your favorite cryptocurrencies',
                features: ['Custom Alerts', 'Email Notifications', 'Multiple Coins'],
                idUser: [1]
            },
            {
                id: 3,
                name: 'Market News',
                description: 'Latest cryptocurrency news and updates',
                features: ['Daily News', 'Market Analysis', 'Trending Topics'],
                idUser: []
            }
        ]);
        console.log(`✅ Đã tạo ${freeTools.length} free tools`);

        // Seed HungtingTier
        console.log('🏆 Đang tạo HungtingTiers...');
        const hungtingTiers = await HungtingTier.insertMany([
            {
                id: 1,
                name: 'Bronze Tier',
                price: 9.99,
                description: 'Basic tier with essential features',
                features: ['Basic Support', 'Limited API Calls', 'Standard Features'],
                limitations: ['100 API calls/day', 'No Priority Support', 'Basic Analytics']
            },
            {
                id: 2,
                name: 'Silver Tier',
                price: 29.99,
                description: 'Intermediate tier with enhanced features',
                features: ['Priority Support', 'More API Calls', 'Advanced Analytics', 'Custom Integrations'],
                limitations: ['1000 API calls/day', 'Standard Response Time', 'Limited Customization']
            },
            {
                id: 3,
                name: 'Gold Tier',
                price: 99.99,
                description: 'Premium tier with all features',
                features: ['24/7 Support', 'Unlimited API Calls', 'Full Analytics', 'Full Customization', 'Dedicated Manager'],
                limitations: []
            },
            {
                id: 4,
                name: 'Platinum Tier',
                price: 199.99,
                description: 'Enterprise tier with maximum benefits',
                features: ['Dedicated Support Team', 'Unlimited Everything', 'Custom Solutions', 'SLA Guarantee', 'On-site Training'],
                limitations: []
            }
        ]);
        console.log(`✅ Đã tạo ${hungtingTiers.length} hunting tiers`);

        console.log('\n🎉 Hoàn thành seed dữ liệu!');
        console.log('\n📊 Tổng kết:');
        console.log(`   - Users: ${users.length}`);
        console.log(`   - Products: ${products.length}`);
        console.log(`   - Powerful: ${powerfuls.length}`);
        console.log(`   - Features: ${features.length}`);
        console.log(`   - Benefits: ${benefits.length}`);
        console.log(`   - FreeTools: ${freeTools.length}`);
        console.log(`   - HungtingTiers: ${hungtingTiers.length}`);

        // Đóng kết nối
        await mongoose.connection.close();
        console.log('\n✅ Đã đóng kết nối MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Lỗi khi seed dữ liệu:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Chạy seed
seedData();

