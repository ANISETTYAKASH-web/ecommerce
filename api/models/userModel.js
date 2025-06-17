const pool = require("../config/db");
require("dotenv").config();
const bcrypt = require("bcrypt");
/**
 * @param {string} email
 * @returns {promise<array>} user
 */

async function findUserByEmail(email) {
  const client = await pool.connect();
  try {
    const result = await client.query("select *from users where email=$1", [
      email,
    ]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}
/**
 * @param {object} user
 * @param {string} user.username
 * @param {string} user.email
 * @param {string} user.password
 * @param {string } user.first_name
 * @param {string} user.last_name
 * @param {boolean} user.is_admin
 * @returns {promise} user
 */
async function createUser(user) {
  const { username, email, password_hash, first_name, last_name } = user;
  const client = await pool.connect();
  try {
    const values = [
      username,
      email,
      password_hash,
      first_name,
      last_name,
      false,
    ];
    const query =
      "insert into users(username,email,password_hash,first_name,last_name,is_admin) values($1,$2,$3,$4,$5,$6) returning username,email,first_name,last_name,is_admin";
    const result = await client.query(query, values);
    console.log(result.rows[0]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}
/**
 * @param {uuid} user_id
 * @returns {promise} user
 */

async function getUserById(user_id) {
  const client = await pool.connect();
  try {
    const result = client.query(
      "select user_id, username, email, first_name, last_name, is_admin from users where user_id=$1",
      [user_id]
    );
    return result.rows[0] || null;
  } finally {
    pool.release();
  }
}

module.exports = {
  getUserById,
  createUser,
  findUserByEmail,
};
