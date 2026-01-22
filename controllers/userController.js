const User = require('../models/User');

const syncSalesforceUser = async (req, res) => {
    try {
        const { sfId, name, email, username } = req.body;

        // Use findOneAndUpdate with 'upsert' to prevent duplicate errors
        const user = await User.findOneAndUpdate(
            { sfId }, 
            { name, email, username, syncedAt: Date.now() },
            { upsert: true, new: true }
        );

        res.status(201).json({
            success: true,
            message: 'User saved to MongoDB Atlas',
            data: user
        });
    } catch (error) {
        console.error('MongoDB Save Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { syncSalesforceUser };