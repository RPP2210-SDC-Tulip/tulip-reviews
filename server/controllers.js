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

// For Leslie -- The current status of the first route I have in semi-working order.
const getProductReviews = (req, res) => {
  // console.log('PRODUCT ID: ', req.query.product_id);
  // **TO-DO** HANDLE SORT (ORDER BY)
  // **TO-DO** HANDLE DATE FORMATTING (Unix Epoch TO UTC, postgres date/time)
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

const getReviewsMeta = (req, res) => {
  console.log('META PRODUCT ID: ', req.query.product_id);
  // Needs to:
    // Get total ratings of each number from reviews table
      // SELECT rating, COUNT (*) AS "ratings" FROM reviews WHERE product_id = 2 GROUP BY rating;
      // LONG BUT WORKING:
      // SELECT JSON_BUILD_OBJECT(1, (SELECT COUNT(*) FILTER (WHERE rating = 1) FROM reviews WHERE product_id = 2), 2, (SELECT COUNT(*) FILTER (WHERE rating = 2) FROM reviews WHERE product_id = 2), 3, (SELECT COUNT(*) FILTER (WHERE rating = 3) FROM reviews WHERE product_id = 2), 4, (SELECT COUNT(*) FILTER (WHERE rating = 4) FROM reviews WHERE product_id = 2), 5, (SELECT COUNT(*) FILTER (WHERE rating = 5) FROM reviews WHERE product_id = 2)) AS ratings;
    // Get total recommended from reviews table ({false: 0, true: 27})
      // SELECT JSON_BUILD_OBJECT('false', (SELECT COUNT(*) FILTER (WHERE NOT recommend) FROM reviews WHERE product_id = 2), 'true', (SELECT COUNT(*) FILTER (WHERE recommend) FROM reviews WHERE product_id = 2)) AS recommended;

    // MEGA QUERY FOR product_id, ratings, recommended -- NEEDS CHARACTERISTICS
    // SELECT JSON_BUILD_OBJECT('product_id', 2, 'ratings', (JSON_BUILD_OBJECT(1, (SELECT COUNT(*) FILTER (WHERE rating = 1) FROM reviews WHERE product_id = 2), 2, (SELECT COUNT(*) FILTER (WHERE rating = 2) FROM reviews WHERE product_id = 2), 3, (SELECT COUNT(*) FILTER (WHERE rating = 3) FROM reviews WHERE product_id = 2), 4, (SELECT COUNT(*) FILTER (WHERE rating = 4) FROM reviews WHERE product_id = 2), 5, (SELECT COUNT(*) FILTER (WHERE rating = 5) FROM reviews WHERE product_id = 2))), 'recommended', (SELECT JSON_BUILD_OBJECT('false', (SELECT COUNT(*) FILTER (WHERE NOT recommend) FROM reviews WHERE product_id = 2), 'true', (SELECT COUNT(*) FILTER (WHERE recommend) FROM reviews WHERE product_id = 2))));

    // Send characteristics object, which is nested with characteristics_name, characteristic_id, and value
      // Portion -- gets average value based on characteristic_id
        // SELECT AVG (value) AS testing FROM characteristic_reviews WHERE characteristic_id = 5 GROUP BY characteristic_id;
      // Portion -- creates an {}
        // SELECT characteristic_id, json_object_agg(review_id, value) tests FROM characteristic_reviews GROUP BY characteristic_id LIMIT 10;
      // In progress - generates an error:
      // SELECT id, name, (SELECT value FROM characteristic_reviews WHERE characteristic_reviews.characteristic_id = characteristics.id) AS "characteristics" FROM characteristics WHERE product_id = 3 GROUP BY name;
      // SELECT name, (SELECT characteristic_id, value FROM characteristic_reviews WHERE characteristic_reviews.characteristic_id = characteristics.id)

    // Test
    // SELECT characteristic_id, json_object_agg('value', (SELECT AVG (value) FROM characteristic_reviews)) testing FROM characteristic_reviews GROUP BY characteristic_id LIMIT 10;
    // json_build_object('id', characteristic_id, 'value', (SELECT AVG (value) FROM characteristic_reviews))
    // SELECT json_build_object('id', characteristic_id, 'value', (SELECT AVG (value) FROM characteristic_reviews GROUP BY characteristic_id)) testing FROM characteristic_reviews LIMIT 10;

    // Another test
    // SELECT id, (SELECT AVG (value) AS testing FROM characteristic_reviews) FROM characteristic_reviews WHERE ((SELECT id FROM reviews) = characteristic_reviews.review_id AND (SELECT product_id FROM reviews) = 2);

  };

const addReview = (req, res) => {
  // console.log('REQ: ', req.body);
  var reqCharIds = [];
  var reqCharValues = [];
  for (var key in req.body.characteristics) {
    reqCharIds.push(Number(key));
    reqCharValues.push(Number(req.body.characteristics[key]));
  };

  var testQuery = ``;

  pool.query(`WITH new_id as
    (INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness)
    VALUES ((SELECT MAX(reviews.id) FROM reviews) + 1, ${req.body.product_id}, ${req.body.rating}, (SELECT EXTRACT(epoch FROM now())), '${req.body.summary}', '${req.body.body}', ${req.body.recommend}, false, '${req.body.name}', '${req.body.email}', 0) RETURNING id),
    photos_ins AS (INSERT INTO reviews_photos(review_id, url) SELECT (SELECT id FROM new_id), UNNEST(array[${req.body.photos}]) RETURNING id)
    INSERT INTO characteristic_reviews (characteristic_id, review_id, value) SELECT UNNEST(array[${reqCharIds}]), (SELECT id FROM new_id), UNNEST(array[${reqCharValues}]);`,
    (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.status(201).send('Review successfully posted!');
    }
    })
};

const addHelpful = (req, res) => {
  // console.log('REQ: ', req.params.review_id);
  pool.query(`UPDATE reviews SET helpfulness =
    ((SELECT helpfulness FROM reviews WHERE id = ${req.params.review_id}) + 1)
    WHERE id = ${req.params.review_id};`, (err, data) => {
    if (err) {
      console.error(err);
    }
    res.status(204).send('Helpfulness changed!');
  })
};

const markReported = (req, res) => {
  // console.log('REQ: ', req.params.review_id);
  pool.query(`UPDATE reviews SET reported = true WHERE id = ${req.params.review_id}`, (err, data) => {
    if (err) {
      console.error(err);
    }
    res.sendStatus(204);
  })
};



module.exports.getProductReviews = getProductReviews;
module.exports.getReviewsMeta = getReviewsMeta;
module.exports.addReview = addReview;
module.exports.addHelpful = addHelpful;
module.exports.markReported = markReported;
