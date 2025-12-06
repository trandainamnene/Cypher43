// File cấu hình database (mẫu)
// Bạn có thể sử dụng MongoDB, PostgreSQL, MySQL, etc.

// Ví dụ với MongoDB (Mongoose)
// const mongoose = require('mongoose');
// 
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('Database connection error:', error);
//     process.exit(1);
//   }
// };
// 
// module.exports = connectDB;

// Ví dụ với PostgreSQL (pg)
// const { Pool } = require('pg');
// 
// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
// });
// 
// module.exports = pool;

// File này để bạn thêm cấu hình database sau
console.log('Database config file - Sẵn sàng để cấu hình database');

