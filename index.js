require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swagger = require('./swagger.js')
//const helmet = require('helmet');

// Nhập routes
const apiRoutes = require('./routes/api');

// Nhập middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const connectDB = require('./config/db');

require('./models');

// Khởi tạo app
const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối Database
connectDB();

// Middleware cơ bản
//app.use(helmet()); // Bảo mật HTTP headers
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://cipher43.com',
      'https://www.cipher43.com',
      process.env.FRONTEND_URL,
      process.env.VERCEL_URL
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.CORS_ALLOW_ALL === 'true') {
      callback(null, true);
    } else {
      console.log("⚠️ Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
})); // Cho phép CORS
app.use(morgan('dev')); // Ghi log các request
app.use(express.json({ limit: '50mb' })); // Phân tích JSON bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Phân tích URL-encoded bodies
app.use('/uploads', express.static('uploads')); // Serve file tĩnh từ thư mục uploads

// Các routes
app.get('/', (req, res) => {
  res.json({
    message: 'Chào mừng đến với Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint for monitoring and Docker
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api', apiRoutes);

// Error handling middleware (phải đặt cuối cùng)
app.use(notFound);
app.use(errorHandler);

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  swagger(app, PORT)
});

module.exports = app;

