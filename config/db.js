const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGO_URI (hoặc MONGODB_URI) không được định nghĩa trong env');
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
