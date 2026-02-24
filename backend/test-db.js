const pool = require("./config/db");

(async () => {
  const result = await pool.query("SELECT NOW()");
  console.log("DB connected:", result.rows[0]);
  process.exit(0);
})();
