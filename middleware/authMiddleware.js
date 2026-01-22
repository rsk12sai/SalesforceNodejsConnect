const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            // Split by space and filter out any empty strings or "Bearer" keywords
            const parts = authHeader.split(' ');
            const token = parts.find(p => p.startsWith('eyJ')); // JWTs always start with 'eyJ'

            if (!token) {
                throw new Error('No valid JWT found in header');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            req.user = decoded;
            return next(); 
        } catch (error) {
            console.error('JWT Verification Failed:', error.message);
            return res.status(401).json({ success: false, message: error.message });
        }
    }

    return res.status(401).json({ success: false, message: 'No Authorization Header' });
};

module.exports = { protect };