const axios = require('axios');
const ProfileModel = require('../models/profileModel');
require('dotenv').config();

const GITHUB_HEADERS = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json'
};

// Analyze & store a GitHub profile
const analyzeProfile = async (req, res) => {
  const { username } = req.params;

  try {
    // 1. Fetch user data from GitHub
    const { data: user } = await axios.get(
      `https://api.github.com/users/${username}`,
      { headers: GITHUB_HEADERS }
    );

    // 2. Fetch repos to calculate total stars & most used language
    const { data: repos } = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      { headers: GITHUB_HEADERS }
    );

    // Calculate total stars
    const total_stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    // Find most used language
    const langCount = {};
    repos.forEach(repo => {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });
    const most_used_language = Object.keys(langCount).length
      ? Object.keys(langCount).reduce((a, b) => langCount[a] > langCount[b] ? a : b)
      : 'N/A';

    // 3. Build insights object
    const profileData = {
      username: user.login,
      name: user.name || null,
      bio: user.bio || null,
      avatar_url: user.avatar_url,
      location: user.location || null,
      company: user.company || null,
      blog: user.blog || null,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      public_gists: user.public_gists,
      total_stars,
      most_used_language,
      account_created_at: user.created_at
    };

    // 4. Save to MySQL
    await ProfileModel.upsertProfile(profileData);

    return res.status(200).json({
      success: true,
      message: `Profile of '${username}' analyzed and stored successfully.`,
      data: profileData
    });

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ success: false, message: `GitHub user '${username}' not found.` });
    }
    console.error(error.message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Get all stored profiles
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await ProfileModel.getAllProfiles();
    return res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Get single profile by username
const getSingleProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const profile = await ProfileModel.getProfileByUsername(username);
    if (!profile) {
      return res.status(404).json({ success: false, message: `Profile '${username}' not found in database. Analyze it first.` });
    }
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { analyzeProfile, getAllProfiles, getSingleProfile }; 
