require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Nhập routes
const apiRoutes = require('./routes/api');

// Nhập middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const connectDB = require('./config/db');

// Khởi tạo app
const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối Database
connectDB();

// Middleware cơ bản
app.use(helmet()); // Bảo mật HTTP headers
app.use(cors()); // Cho phép CORS
app.use(morgan('dev')); // Ghi log các request
app.use(express.json()); // Phân tích JSON bodies
app.use(express.urlencoded({ extended: true })); // Phân tích URL-encoded bodies

// Các routes
app.get('/', (req, res) => {
  res.json({
    message: 'Chào mừng đến với Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/protected'));
app.use('/api', apiRoutes);

// Error handling middleware (phải đặt cuối cùng)
app.use(notFound);
app.use(errorHandler);

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

