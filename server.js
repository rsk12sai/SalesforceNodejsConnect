const express = require('express');
const cors = require('cors');
const sfRoutes = require('./Routes/sfRoutes'); 
const app = express(); 

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

// 2. Middleware
app.use(express.json());

// 3. Mount Routes
app.use('/api', sfRoutes);

// 4. Start Server
const PORT = process.env.PORT || 3000; // Render uses process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});