// Middleware xử lý route không tồn tại

const notFound = (req, res, next) => {
  console.log(req)
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} không tồn tại`
  });
};

module.exports = notFound;

