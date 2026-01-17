//@ts-nocheck
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    username: {
        type: String,
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
    accountType: {
        type: String,
        enum: ['basic', 'premium'],
        default: 'basic'
    },
    trackedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Mã hóa password trước khi lưu
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(`this password: ${this.password}`);
});

// Mã hóa cho insert hàng loạt(test)
userSchema.pre('insertMany', async function (docs) {
    console.log(`docs: ${docs}`);
    const salt = await bcrypt.genSalt(10);
    const hashedDocs = docs.map(async (doc) => {
        if (doc.password) {
            doc.password = await bcrypt.hash(doc.password, salt);
        } else {
            console.warn(`User ${doc.name || 'ẩn danh'} bị thiếu password!`);
        }
    });

    await Promise.all(hashedDocs);
});

// Phương thức để kiểm tra password
userSchema.methods.matchPassword = async function (enteredPassword) {
    console.log('enteredPassword: ', enteredPassword)
    console.log('this password: ', this.password)
    console.log('is Match Password : ', await bcrypt.compareSync(enteredPassword, this.password))
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
