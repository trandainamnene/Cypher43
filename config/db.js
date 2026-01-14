const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI ||
            process.env.MONGODB_URI ||
            process.env.MONGO_URL ||
            process.env.DATABASE_URL;

        if (!mongoURI) {
            console.error('❌ CRITICAL ERROR: No Database Connection String found!');
            console.error('Checking for: MONGO_URI, MONGODB_URI, MONGO_URL, DATABASE_URL');
            console.error('Available Environment Variables:', Object.keys(process.env).join(', '));
            throw new Error('Database connection string not defined in environment variables');
        }

        const conn = await mongoose.connect(mongoURI, {
            // Các tùy chọn này không còn cần thiết trong Mongoose 6+ nhưng giữ lại tham chiếu nếu dùng phiên bản cũ
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
