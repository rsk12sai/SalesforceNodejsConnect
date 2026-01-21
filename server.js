const express = require('express');
const sfRoutes = require('./routes/sfRoutes');

const app = express();
app.use(express.json());

// Mount the Salesforce routes under /api
app.use('/api', sfRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Try: http://localhost:3000/api/contacts?search=John&page=1&limit=5`);
});