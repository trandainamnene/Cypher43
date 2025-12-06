// Controller mẫu để test API

const getTest = (req, res) => {
  try {
    res.json({
      success: true,
      message: 'GET request thành công!',
      data: {
        method: 'GET',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

const postTest = (req, res) => {
  try {
    const { body } = req;
    res.json({
      success: true,
      message: 'POST request thành công!',
      data: {
        method: 'POST',
        receivedData: body,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

module.exports = {
  getTest,
  postTest
};

