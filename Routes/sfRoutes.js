const express = require('express');
const router = express.Router();

// 1. IMPORT THE PROTECT MIDDLEWARE
const { protect } = require('../middleware/authMiddleware');

// 2. IMPORT THE CONTROLLER (This is what was missing)
const sfController = require('../controllers/sfController'); 
const sfContact = require('../controllers/Contact'); 
const userController = require('../controllers/userController');
const syncController = require('../controllers/syncController');

// 3. IMPORT THE OTHER CONTROLLERS IF NEEDED
const { login } = require('../controllers/authController');
const weatherController = require('../controllers/weatherController');

// --- ROUTES ---
router.post('/login', login);

// Now sfController will be defined here:
router.get('/accounts', protect, sfController.getAccounts);
router.get('/contacts', protect, sfController.getContacts);
router.get('/opportunities', protect, sfController.getOpportunities);
router.get('/getUsers', protect, weatherController.getMockUsers);
router.get('/getPosts', protect, weatherController.getMockPosts);


//Post API 
router.post('/createAccount', protect, sfController.createAccount);
router.post('/createContact', protect, sfContact.createContact);
router.post('/users/create', protect, userController.syncSalesforceUser);

// --- NEW: MONGODB -> SALESFORCE SYNC ROUTES ---
/** * This handles your "Check External Customer -> Upsert Work Profile" logic.
 * It works for both Insert and Update.
 */
router.post('/syncWorkProfile', protect, syncController.saveAndSync);

/** * READ: Returns combined data from MongoDB (Customer + Profile)
 */
router.get('/workProfiles', protect, syncController.readProfiles);

/** * DELETE: Deletes ONLY the Work Profile in SF and the doc in MongoDB.
 * Leaves the External Customer record intact in Salesforce.
 */
router.delete('/workProfile/:id', protect, syncController.removeProfileOnly);

router.get('/readBulkTestProfiles',syncController.readBulkTestProfiles);

module.exports = router;