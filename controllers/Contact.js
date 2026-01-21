const axios = require('axios');
const { getAccessToken } = require('../salesforceAuth'); // Adjust path as needed
const logger = require('../utils/logger');


const createContact = async (req, res) => {
    try {
        const { accessToken, instanceUrl } = await getAccessToken();
        
        // 1. Get account data from request body
        const accountData = req.body;



        // 2. Salesforce REST API Endpoint for Account Creation
        const url = `${instanceUrl}/services/data/v60.0/sobjects/Contact`;

        // 3. POST request to Salesforce
        const response = await axios.post(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        logger.info(`Account created successfully: ${response.data.id}`);

        // 4. Return the new Account ID
        res.status(201).json({
            success: true,
            message: "Contact created successfully"
        });

    } catch (error) {
        logger.error('Create Account Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data || "Failed to create account"
        });
    }
};


module.exports = {
    createContact
};