const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI không được định nghĩa trong file .env');
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
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
