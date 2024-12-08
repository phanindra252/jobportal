// server/db.js
const { Pool } = require("pg"); // Import Pool from pg package

// Database connection setup using environment variables
const pool = new Pool({
  user: process.env.DB_USER, // PostgreSQL username from .env
  host: process.env.DB_HOST, // PostgreSQL host from .env
  database: process.env.DB_NAME, // Database name from .env
  password: process.env.DB_PASSWORD, // Password from .env
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port, or use the one from .env
});

// Export the pool to be used in other files
module.exports = pool;
