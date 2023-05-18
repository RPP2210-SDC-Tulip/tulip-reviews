require('dotenv').config();
const Pool = require('pg').Pool;

const myUsername = process.env.MY_USERNAME;
const myPassword = process.env.MY_PASSWORD;
const myHost = process.env.MY_HOST;
const myDatabase = process.env.MY_DB;
const myPort = process.env.MY_PORT;

const pool = new Pool({
  user: myUsername,
  host: myHost,
  database: myDatabase,
  password: myPassword,
  port: myPort
});

pool.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Database connected!');
  }
})

module.exports = pool;
