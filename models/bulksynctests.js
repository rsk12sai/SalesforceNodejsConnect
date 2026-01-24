const mongoose = require('mongoose');

const bulkTestSchema = new mongoose.Schema({
    externalId: String,
    customerName: String,
    status: String,
    todayRevenue: Number,
    todayTarget: Number,
    syncStatus: { type: String, default: 'Pending' }
}, { 
    collection: 'bulksynctests' 
});

// IMPORTANT: Do not use { BulkSyncTest }. Export the model directly.
module.exports = mongoose.model('BulkSyncTest', bulkTestSchema);