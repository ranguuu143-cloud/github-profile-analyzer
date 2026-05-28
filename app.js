const express = require('express');
const cors = require('cors');
require('dotenv').config();

const profileRoutes = require('./src/routes/profileRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GitHub Profile Analyzer API is running!',
    endpoints: {
      analyze: 'POST /api/analyze/:username',
      getAllProfiles: 'GET /api/profiles',
      getSingleProfile: 'GET /api/profiles/:username'
    }
  });
});

// API Routes
app.use('/api', profileRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
