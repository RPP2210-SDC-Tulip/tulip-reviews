// Functions to take in the paths from index.js will go here once I read more about the reviews API
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

const getReviewsTest = (req, res) => {
  pool.query('SELECT * FROM reviews_photos LIMIT 10', (err, data) => {
    if (err) {
      console.error(err);
    }
    res.status(200).send(data.rows);
  })
};

module.exports.getReviewsTest = getReviewsTest;
