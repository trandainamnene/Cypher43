const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
        const { username, password } = req.body;

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            password,
        });

        if (user) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Lưu refresh token vào DB
            user.refreshToken = refreshToken;
            await user.save();

            res.status(201).json({
                _id: user._id,
                username: user.username,
                accessToken,
                refreshToken
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        // @ts-ignore
        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Lưu refresh token vào DB (xoay token)
            user.refreshToken = refreshToken;
            await user.save();

            res.json({
                _id: user._id,
                username: user.username,
                accessToken,
                refreshToken
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.log(error)
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
        const { username, password } = req.body;
        const user = await User.findOne({ username });

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
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};
