const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { username, password } = req.body;

    // Replace this with a database check in production
    if (username === 'admin' && password === 'salesforce123') {
        const payload = {
            user: username,
            role: 'admin'
        };

        // Sign the token (expires in 1 hour)
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

        return res.json({
            success: true,
            token: `Bearer ${token}`
        });
    }

    res.status(401).json({ success: false, message: 'Invalid credentials' });
};

module.exports = { login };