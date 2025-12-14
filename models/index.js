// File này load tất cả models để đảm bảo chúng được đăng ký với Mongoose
// MongoDB sẽ tự động tạo collections khi bạn lưu document đầu tiên

const User = require('./User');
const Product = require('./Product');
const Powerful = require('./Powerful');
const Features = require('./Features');
const Benefit = require('./Benefit');
const FreeTool = require('./Freetool');
const HungtingTier = require('./HungtingTier');

// Export tất cả models để có thể import dễ dàng
module.exports = {
    User,
    Product,
    Powerful,
    Features,
    Benefit,
    FreeTool,
    HungtingTier
};

