// Notes from OH w/ Leslie:
// File that connects to the database, sets up schemas
// Will likely need to use this to create schema/db for deployment to ec2 (SQL file)

require('dotenv').config();
const Pool = require('pg').Pool;
const myUsername = process.env.MY_USERNAME;
const myPassword = process.env.MY_PASSWORD;
const pool = new Pool({
  user: myUsername,
  host: 'localhost',
  database: 'reviews',
  password: myPassword,
  port: 5432
});

module.exports = pool;
