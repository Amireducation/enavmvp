const pool = require("../config/db")

async function createOrUpdateProfile(userId, data) {
  const sql = `
    INSERT INTO user_profiles (user_id, full_name, phone, date_of_birth, address, city, region, language_preference)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (user_id) DO UPDATE SET
      full_name = $2,
      phone = $3,
      date_of_birth = $4,
      address = $5,
      city = $6,
      region = $7,
      language_preference = $8,
      updated_at = now()
    RETURNING *
  `
  const values = [
    userId,
    data.full_name,
    data.phone,
    data.date_of_birth,
    data.address,
    data.city,
    data.region,
    data.language_preference || "en",
  ]
  const res = await pool.query(sql, values)
  return res.rows[0]
}

async function getProfile(userId) {
  const sql = "SELECT * FROM user_profiles WHERE user_id = $1"
  const res = await pool.query(sql, [userId])
  return res.rows[0]
}

module.exports = {
  createOrUpdateProfile,
  getProfile,
}
