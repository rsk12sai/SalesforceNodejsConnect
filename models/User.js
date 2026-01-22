const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    sfId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String },
    isActive: { type: Boolean, default: true },
    syncedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);