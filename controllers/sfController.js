const axios = require('axios');
const { getAccessToken } = require('../salesforceAuth'); // Adjust path as needed
const logger = require('../utils/logger');

const getSObjectData = async (req, res, sObjectType) => {
    try {
        const { accessToken, instanceUrl } = await getAccessToken();

        // 1. Get Query Params (Search, Page, Limit)
        const search = req.query.search || '';
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        // 2. Build SOQL Query
        // Note: Different objects might need different fields
        let fields = "Id, Name, CreatedDate";
        if (sObjectType === 'Opportunity') fields += ", Amount, StageName";
        if (sObjectType === 'Contact') fields += ", Email, Phone";

        let query = `SELECT ${fields} FROM ${sObjectType}`;
        
        if (search) {
            query += ` WHERE Name LIKE '%${search}%'`;
        }

        query += ` ORDER BY CreatedDate DESC LIMIT ${limit} OFFSET ${offset}`;

        // 3. Request to Salesforce Query REST API
        const response = await axios.get(`${instanceUrl}/services/data/v60.0/query`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { q: query }
        });

        // 4. Return formatted response
        res.json({
            success: true,
            totalRecords: response.data.totalSize,
            page,
            limit,
            data: response.data.records
        });

    } catch (error) {
        console.error(`Error fetching ${sObjectType}:`, error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: error.response?.data?.[0]?.message || "Internal Server Error" 
        });
    }
};

const createAccount = async (req, res) => {
    try {
        const { accessToken, instanceUrl } = await getAccessToken();
        
        // 1. Get account data from request body
        const accountData = req.body;

        // Validation: Salesforce requires 'Name' for Accounts
        if (!accountData.Name) {
            return res.status(400).json({ success: false, message: "Account 'Name' is required." });
        }

        // 2. Salesforce REST API Endpoint for Account Creation
        const url = `${instanceUrl}/services/data/v60.0/sobjects/Account`;

        // 3. POST request to Salesforce
        const response = await axios.post(url, accountData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        logger.info(`Account created successfully: ${response.data.id}`);

        // 4. Return the new Account ID
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            accountId: response.data.id
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
    getAccounts: (req, res) => getSObjectData(req, res, 'Account'),
    getContacts: (req, res) => getSObjectData(req, res, 'Contact'),
    getOpportunities: (req, res) => getSObjectData(req, res, 'Opportunity'),
    createAccount
};