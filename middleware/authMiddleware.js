const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const protect = (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            // Get token from "Bearer <token>"
            const token = authHeader.split(' ')[1];

            // Verify token - MUST MATCH YOUR LOGIN SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            
            req.user = decoded;
            return next(); // Stop here and go to the controller
        } catch (error) {
            logger.error('JWT Verification Failed: %s', error.message);
            // Return here to stop execution
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    // If we reach here, it means no "Bearer" header was present at all
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
};

module.exports = { protect };