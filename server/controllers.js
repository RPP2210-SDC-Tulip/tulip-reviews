// Functions to take in the paths from index.js will go here once I read more about the reviews API
require('dotenv').config();
// Can migrate all of the connections to the database index.js location (connecting to the db)
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

const getProductReviews = (req, res) => {
  console.log('PRODUCT ID: ', req.query.product_id);
  // **TO-DO** HANDLE SORT
  // **TO-DO** HANDLE DATE FORMATTING
  // **TO-DO** DO NOT SEND REPORTED REVIEWS
  pool.query(`SELECT id AS review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness,
    (SELECT COALESCE (JSON_AGG(temporary_photos), '[]') FROM (SELECT id, url FROM reviews_photos WHERE reviews_photos.review_id = reviews.id)
    AS temporary_photos) AS photos
    FROM reviews WHERE product_id = ${req.query.product_id} LIMIT 5;`, (err, data) => {
    if (err) {
      console.error(err);
    }
    let result = {
      product: req.query.product_id,
      page: req.query.page || 1,
      count: req.query.count || 5,
      results: data.rows
    }
    res.status(200).send(result);
  })
};

module.exports.getProductReviews = getProductReviews;
