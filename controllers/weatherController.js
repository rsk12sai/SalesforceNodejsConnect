const axios = require('axios');

const getMockUsers = async (req, res) => {
    try {
        // You can also add pagination logic here similar to your SF controller
        const limit = req.query.limit || 10;
        
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users?_limit=${limit}`);
        
        res.json({
            success: true,
            source: 'JSONPlaceholder',
            data: response.data
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getMockPosts = async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5');
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getMockUsers, getMockPosts };