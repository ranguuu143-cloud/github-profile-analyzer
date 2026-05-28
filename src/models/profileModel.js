const db = require('../config/db');

const ProfileModel = {
  // Save or update a profile
  async upsertProfile(data) {
    const sql = `
      INSERT INTO profiles 
        (username, name, bio, avatar_url, location, company, blog,
         public_repos, followers, following, public_gists,
         total_stars, most_used_language, account_created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name), bio=VALUES(bio), avatar_url=VALUES(avatar_url),
        location=VALUES(location), company=VALUES(company), blog=VALUES(blog),
        public_repos=VALUES(public_repos), followers=VALUES(followers),
        following=VALUES(following), public_gists=VALUES(public_gists),
        total_stars=VALUES(total_stars), most_used_language=VALUES(most_used_language),
        account_created_at=VALUES(account_created_at), updated_at=NOW()
    `;
    const values = [
      data.username, data.name, data.bio, data.avatar_url,
      data.location, data.company, data.blog, data.public_repos,
      data.followers, data.following, data.public_gists,
      data.total_stars, data.most_used_language, data.account_created_at
    ];
    const [result] = await db.execute(sql, values);
    return result;
  },

  // Get all profiles
  async getAllProfiles() {
    const [rows] = await db.execute('SELECT * FROM profiles ORDER BY analyzed_at DESC');
    return rows;
  },

  // Get single profile by username
  async getProfileByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM profiles WHERE username = ?', [username]);
    return rows[0] || null;
  }
};

module.exports = ProfileModel; 
