const axios = require('axios');
async function getAccessToken() {
    // 1. Define your credentials (use environment variables in production!)
    const config = {
        clientId: process.env.SF_CLIENT_ID,
        clientSecret: process.env.SF_CLIENT_SECRET,
        loginUrl: process.env.SF_LOGIN_URL
    };

    // 2. Prepare the payload
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', config.clientId);
    params.append('client_secret', config.clientSecret);

    try {
        // 3. POST to the token endpoint
        const response = await axios.post(`${config.loginUrl}/services/oauth2/token`, params);
        
        console.log('--- Authentication Successful ---');
        return {
            accessToken: response.data.access_token,
            instanceUrl: response.data.instance_url
        };
    } catch (error) {
        console.error('Auth Error:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Salesforce');
    }
}

module.exports = { getAccessToken };

// --- Add this block to run it directly ---
if (require.main === module) {
    console.log("Starting Authentication...");
    getAccessToken()
        .then(data => {
            console.log("Token:", data.accessToken);
            console.log("Instance:", data.instanceUrl);
        })
        .catch(err => {
            // This will catch the 'Failed to authenticate' error you threw
            console.error("Execution stopped."); 
        });
}