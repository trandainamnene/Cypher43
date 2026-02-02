const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Tạo Access Token (Thời gian ngắn, ví dụ: 15 phút)
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};

// Tạo Refresh Token (Thời gian dài, ví dụ: 7 ngày)
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};



exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email này đã được sử dụng' });
        }

        // Tạo verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');

        const user = await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            username: email.split('@')[0], // Tự tạo username từ email
            password,
            verificationToken,
            verificationTokenExpire: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 giờ
        });

        if (user) {
            // Gửi email xác thực
            // Sử dụng FRONTEND_URL từ env hoặc fallback về localhost
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;
            const message = `Cảm ơn bạn đã đăng ký. Vui lòng click vào link sau để xác thực email: \n\n <a href="${verifyUrl}">Xác thực tài khoản</a>`;

            await sendEmail({
                email: user.email,
                subject: 'Xác thực tài khoản Cipher 43 Lab',
                message
            });

            res.status(201).json({
                message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
                // Trong môi trường dev, trả về token luôn để test cho nhanh
                ...(process.env.NODE_ENV === 'development' && { devToken: verificationToken })
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token xác thực không hợp lệ hoặc đã hết hạn' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save();

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            message: 'Email đã được xác thực thành công!',
            _id: user._id,
            email: user.email,
            accessToken,
            refreshToken
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu' });
        }


        // Tìm user theo email
        const user = await User.findOne({ email });

        // @ts-ignore
        if (user && (await user.matchPassword(password))) {
            // Check verify
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Vui lòng xác thực email trước khi đăng nhập!' });
            }

            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Lưu refresh token vào DB (xoay token)
            user.refreshToken = refreshToken;
            await user.save();

            res.json({
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                accessToken,
                refreshToken
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Bảo mật: Coi như đã gửi để tránh dò user
            return res.status(200).json({ message: 'Nếu email tồn tại, chúng tôi đã gửi link reset password.' });
        }

        // Tạo reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token và lưu vào DB
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        await user.save();

        // Gửi email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
        const message = `Bạn nhận được email này vì yêu cầu reset mật khẩu. \n\n Vui lòng click vào link sau: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Reset Password Token',
                message
            });

            res.status(200).json({
                message: 'Email reset password đã được gửi.',
                // Dev only
                devResetToken: resetToken
            });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Không thể gửi email' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Hash token từ URL để so sánh với DB
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        }

        // Set password mới (middleware pre-save của User model sẽ tự hash)
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công!' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token is required' });
    }

    try {
        // Xác thực token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        if (typeof decoded === 'string') {
            return res.status(403).json({ message: 'Invalid Refresh Token' });
        }

        // Tìm user theo id và refresh token khớp
        const user = await User.findOne({ _id: decoded.id, refreshToken });

        if (!user) {
            return res.status(403).json({ message: 'Refresh token is not valid' });
        }

        // Tạo token mới
        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Cập nhật refresh token trong DB
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Invalid Refresh Token' });
    }
};

exports.logout = async (req, res) => {
    try {
        // Client nên xóa token ở phía họ
        // Phía server chúng ta có thể xóa refresh token trong DB
        const { refreshToken } = req.body;
        if (refreshToken) {
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!password || (!email && !username)) {
            return res.status(400).json({ message: 'Vui lòng cung cấp (Email hoặc Username) và Mật khẩu' });
        }

        // Cho phép login admin bằng cả email hoặc username
        // Ưu tiên email nếu có
        const query = email ? { email } : { username };
        const user = await User.findOne(query);

        // @ts-ignore
        if (user && (await user.matchPassword(password))) {
            if (user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. You are not an admin.' });
            }

            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Lưu refresh token vào DB (xoay token)
            user.refreshToken = refreshToken;
            await user.save();

            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                accessToken,
                refreshToken
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};
