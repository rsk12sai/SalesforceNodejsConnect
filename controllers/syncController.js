const WorkProfile = require('../models/WorkProfile');
const BulkSyncTest = require('../models/bulksynctests');
const { syncWorkProfileToSF, deleteProfileFromSF } = require('../services/salesforceService');
const sfService = require('../services/salesforceService');
console.log('Available SF Functions:', sfService);
const logger = require('../utils/logger');

// CREATE & UPDATE (Write)
exports.saveAndSync = async (req, res) => {
    try {
        const { externalId } = req.body;
        
        // 1. Update/Insert in MongoDB
        // The Middleware in the Model will detect this and hit Salesforce automatically
        const profile = await WorkProfile.findOneAndUpdate(
            { externalId },
            { ...req.body, lastSync: new Date() },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: "Data saved to MongoDB. Salesforce sync triggered via middleware.",
            data: profile
        });
    } catch (error) {
        logger.error('Sync Controller Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// READ (Combined View)
exports.readProfiles = async (req, res) => {
    try {
        const profiles = await WorkProfile.find();
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch profiles" });
    }
};

// DELETE (Profile Only)
exports.removeProfileOnly = async (req, res) => {
    try {
        const { id } = req.params; // This is the externalId

        // 1. Delete from MongoDB
        await WorkProfile.findOneAndDelete({ externalId: id });

        // 2. Delete Work Profile in Salesforce (Leave Customer Intact)
        await deleteProfileFromSF(id);

        res.status(200).json({
            success: true,
            message: "Work Profile deleted. External Customer remains in Salesforce."
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// READ ALL FROM BULK TEST COLLECTION
exports.readBulkTestProfiles = async (req, res) => {
    try {
        // .lean() is critical here for performance with 10k records
        const testProfiles = await BulkSyncTest.find().lean();
        
        res.status(200).json({
            success: true,
            count: testProfiles.length,
            data: testProfiles
        });
    } catch (error) {
        logger.error('Bulk Read Error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch bulk test records" 
        });
    }
};