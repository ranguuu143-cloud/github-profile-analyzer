const express = require('express');
const router = express.Router();
const { analyzeProfile, getAllProfiles, getSingleProfile } = require('../controllers/profileController');

// Analyze & store a GitHub profile
router.post('/analyze/:username', analyzeProfile);

// Get all stored profiles
router.get('/profiles', getAllProfiles);

// Get single profile by username
router.get('/profiles/:username', getSingleProfile);

module.exports = router; 
