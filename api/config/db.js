const { Pool, Connection } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  databse: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20,
  idleTimeoutMillis: 3000,
  ConnectionTimeoutMillis: 3000,
});

pool.on("connect", () => {
  console.log("database connected!");
});
pool.on("remove", () => {
  console.log("database connection disconnected");
});
module.exports = pool;
