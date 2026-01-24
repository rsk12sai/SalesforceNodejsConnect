const axios = require('axios');
const { getAccessToken } = require('../salesforceAuth');
const logger = require('../utils/logger');

const syncWorkProfileToSF = async (doc) => {
    try {
        const { accessToken, instanceUrl } = await getAccessToken();
        const apiVersion = 'v60.0';
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        // 1. UPSERT EXTERNAL CUSTOMER
        // Test with External_ID__c (Capital D) if External_Id__c fails
        const extIdField = 'External_ID__c'; 
        const customerUrl = `${instanceUrl}/services/data/${apiVersion}/sobjects/External_Customer__c/${extIdField}/${doc.externalId}`;
        
        console.log(`🚀 Attempting Sync to URL: ${customerUrl}`);

        await axios.patch(customerUrl, {
            Name: doc.customerName
        }, { headers });

        // 2. UPSERT WORK PROFILE
        // Note: Ensure Employee_Id__c is also an External ID in Salesforce
        const profileUrl = `${instanceUrl}/services/data/${apiVersion}/sobjects/Work_Profile__c/Name/${doc.externalId}`;
        
        await axios.patch(profileUrl, {
            Work_Profile_Status__c: doc.status,
            Today_Revenue__c: doc.todayRevenue,
            Today_Target__c: doc.todayTarget,
            Last_Status_Change__c: new Date().toISOString(),
            'Current_Customer__r': { 'External_Id__c': doc.externalId }
        }, { headers });

        logger.info(`✅ Salesforce Sync Success: ${doc.externalId}`);
    } catch (error) {
        // Detailed log to see EXACTLY what Salesforce dislikes
        console.error('❌ Full SF Error Context:', JSON.stringify(error.response?.data, null, 2));
        logger.error(`❌ SF Sync Error: ${error.response?.data?.[0]?.message || error.message}`);
    }
};

const deleteProfileFromSF = async (externalId) => {
    try {
        const { accessToken, instanceUrl } = await getAccessToken();
        const url = `${instanceUrl}/services/data/v60.0/sobjects/Work_Profile__c/Name/${externalId}`;
        
        await axios.delete(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        logger.info(`🗑️ Work Profile deleted in SF: ${externalId}`);
    } catch (error) {
        logger.error('❌ SF Delete Error:', error.response?.data || error.message);
    }
};

module.exports = { syncWorkProfileToSF, deleteProfileFromSF };