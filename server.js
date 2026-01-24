require('dotenv').config(); // Load .env file
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 1. Import Mongoose
const sfRoutes = require('./Routes/sfRoutes'); 

const app = express(); 

// 2. MongoDB Cloud Connection
const MONGO_URI = "mongodb+srv://sai:sai@atlascluster.1usjo.mongodb.net/SalesforceSync?retryWrites=true&w=majority"; 
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas Cloud'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error Details:');
        console.error('Code:', err.code);
        console.error('Hostname:', err.hostname);
        console.error('Message:', err.message);
    });

const allowedOrigins = [
    'https://rsk7-dev-ed.lightning.force.com',
    'https://rsk7-dev-ed.my.salesforce.com'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS policy violation'), false);
        }
        return callback(null, true);
    }
}));

app.use(express.json());

// 3. Mount Routes
app.use('/api', sfRoutes);

app.use('/odata', WorkProfileODataServer.create());


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});