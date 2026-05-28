# GitHub Profile Analyzer API

A backend service built with Node.js, Express, and MySQL that analyzes GitHub user profiles using the GitHub public API and stores useful insights in a database.

## Tech Stack
- Node.js
- Express.js
- MySQL
- GitHub REST API
- Axios

## Features
- Fetch and analyze any GitHub public profile
- Store insights: repos, followers, following, stars, top language, etc.
- List all analyzed profiles
- Fetch a single stored profile

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/analyze/:username` | Analyze & store a GitHub profile |
| GET | `/api/profiles` | Get all stored profiles |
| GET | `/api/profiles/:username` | Get a single stored profile |

## Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/github-profile-analyzer.git
cd github-profile-analyzer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup MySQL
```bash
mysql -u root -p
CREATE DATABASE github_analyzer;
USE github_analyzer;
source schema.sql;
EXIT;
```

### 4. Configure environment variables
Create a `.env` file:
