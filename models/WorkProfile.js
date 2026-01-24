const mongoose = require('mongoose');
// Use the exact name from your service file
const { syncWorkProfileToSF } = require('../services/salesforceService'); 

const WorkProfileSchema = new mongoose.Schema({
    externalId: { type: String, required: true, unique: true },
    customerName: String,
    status: String,
    todayRevenue: Number,
    todayTarget: Number,
    lastSync: Date
});

// SINGLE SYNC TRIGGER: Fires after MongoDB update
WorkProfileSchema.post('findOneAndUpdate', async function(doc) {
    if (doc) {
        console.log('🔄 Middleware Triggered: Syncing to Salesforce...');
        await syncWorkProfileToSF(doc);
    }
});

module.exports = mongoose.model('WorkProfile', WorkProfileSchema);