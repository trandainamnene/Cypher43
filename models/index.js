// File này load tất cả models để đảm bảo chúng được đăng ký với Mongoose
// MongoDB sẽ tự động tạo collections khi bạn lưu document đầu tiên

const User = require('./User');
const Product = require('./Product');
const Features = require('./Features');
const Benefit = require('./Benefit');
const Tool = require('./Tool');
const HungtingTier = require('./HungtingTier');
const Subscriber = require('./Subscriber');

// Export tất cả models để có thể import dễ dàng
module.exports = {
    User,
    Product,
    Features,
    Benefit,
    Tool,
    HungtingTier,
    Subscriber
};

