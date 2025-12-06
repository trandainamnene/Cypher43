require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Import routes
const apiRoutes = require('./routes/api');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Khởi tạo app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware cơ bản
app.use(helmet()); // Bảo mật HTTP headers
app.use(cors()); // Cho phép CORS
app.use(morgan('dev')); // Logging requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Chào mừng đến với Backend API',
    version: '1.0.0',
    status: 'running'
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
});

module.exports = app;

