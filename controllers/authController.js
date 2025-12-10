const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate Access Token (Short lived, e.g., 15m)
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};

// Generate Refresh Token (Long lived, e.g., 7d)
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

            // Save refresh token to DB
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

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Save refresh token to DB (rotate token)
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
        res.status(500).json({ message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token is required' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Find user by id and matching refresh token
        const user = await User.findOne({ _id: decoded.id, refreshToken });

        if (!user) {
            return res.status(403).json({ message: 'Refresh token is not valid' });
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Update refresh token in DB
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
        // Client should delete token on their side
        // Server side we can clear the refresh token in DB
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
