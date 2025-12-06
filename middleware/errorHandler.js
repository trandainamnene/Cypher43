// Middleware xử lý lỗi

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Lỗi từ Joi validation (nếu sử dụng)
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.details.map(detail => detail.message)
    });
  }

  // Lỗi từ Express
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message || 'Có lỗi xảy ra'
    });
  }

  // Lỗi mặc định
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Lỗi server nội bộ' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;

