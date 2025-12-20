//@ts-nocheck
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    refreshToken: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Mã hóa password trước khi lưu
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(`this password: ${this.password}`);
});

// Mã hóa cho insert hàng loạt (test)
// userSchema.pre('insertMany', async function (docs) {
//     console.log(`docs: ${docs}`);
//     const salt = await bcrypt.genSalt(10);
//     const hashedDocs = docs.map(async (doc) => {
//         if (doc.password) {
//             doc.password = await bcrypt.hash(doc.password, salt);
//         } else {
//             console.warn(`User ${doc.name || 'ẩn danh'} bị thiếu password!`);
//         }
//     });

//     await Promise.all(hashedDocs);
// });

// Phương thức để kiểm tra password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
