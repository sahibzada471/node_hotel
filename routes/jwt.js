const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    // Check if authorization header exists
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract token
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // Only call next() if verification succeeds
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { jwtAuthMiddleware, generateToken };