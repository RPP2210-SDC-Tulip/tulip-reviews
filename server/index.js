const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const controllers = require('./controllers.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.send('Hello World from Reviews Microservice!')
// });

// app.get('/', db.getReviewsTest);

// Returns a list of reviews for a particular product
  // Does not include any reported reviews
  // Query parameters:
    // page - INT, default to 1
    // count - INT, default to 5
    // sort - TXT, changes sort order based on "newest", "helpful", or "relevant"
    // product_id - INT, specifies which product to retrieve reviews for
  // Response: 200
// app.get('/reviews/', (req, res) => {
// });
// For Leslie -- The current status of the first route I have in semi-working order. The rest are pseudocode for me to work on tomorrow.
app.get('/reviews/', controllers.getProductReviews); // View of MVC

// Returns review metadata for a given product
  // Query parameters:
    // product_id - INT, id of product for which data should be returned
  // Response: 200
app.get('/reviews/meta', controllers.getReviewsMeta);

// Adds a review for a given product
  // Body parameters:
    // product_id - INT, id of product to post review for
    // rating - INT, range 1-5
    // summary - TEXT
    // body - TEXT
    // recommend - BOOL
    // name - username
    // email - email address
    // photos - [TEXT]
    // characteristics - {"characteristic_id1": review_value, "characteristic_id2": review_value}
  // Response: 201
app.post('/reviews', controllers.addReview);
// POSTS to reviews table
// INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness) VALUES ((SELECT MAX(reviews.id) FROM reviews) + 1, 9, 3, (SELECT EXTRACT(epoch FROM now())), 'hello I am a test', 'testing is so much fun yay testing', true, false, 'me', 'me@gmail.com', 0);
// WITH new_review_id as ( RETURNING id) INSERT INTO reviews_photos(id, review_id, url) VALUES ((SELECT MAX(reviews_photos.id) FROM reviews_photos) + 1, review_id, 'testingtestingtesting')
// Allows inserting photos as well: -- now needs inserting into characteristics
  // WITH new_id as (INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness) VALUES ((SELECT MAX(reviews.id) FROM reviews) + 1, 9, 3, (SELECT EXTRACT(epoch FROM now())), 'hello I am a newer test', 'testing is so much fun yay testing woohooooo', true, false, 'me777', 'me777@gmail.com', 0) RETURNING id) INSERT INTO reviews_photos(review_id, url) SELECT (SELECT id FROM new_id), UNNEST(array['sampleurl34', 'sampleurl88']) INSERT INTO characteristic_reviews xyz;

  // Working
  // INSERT INTO characteristic_reviews(id, characteristic_id, review_id, value) SELECT 19327576, (SELECT js.key FROM json_each_text('{"5": 3}') AS js)::int, 5774956, (SELECT js.value FROM json_each_text('{"5": 3}') AS js)::int;


  // Not working
  // INSERT INTO characteristic_reviews(id, characteristic_id, review_id, value) SELECT 19327577, UNNEST(array[(SELECT js.key FROM json_each_text('{"5": 3, "9": 12}') AS js)::int]), 5774956, UNNEST(array[(SELECT js.value FROM json_each_text('{"5": 3, "9": 12}') AS js)::int]);

  // WITH new_id as (INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness) VALUES ((SELECT MAX(reviews.id) FROM reviews) + 1, 9, 3, (SELECT EXTRACT(epoch FROM now())), 'hello I am a newer test', 'testing is so much fun yay testing woohooooo', true, false, 'me777', 'me777@gmail.com', 0) RETURNING id) INSERT INTO characteristic_reviews(id, characteristic_id, review_id) SELECT 19327577, UNNEST(array[SELECT array_agg FROM (SELECT ARRAY_AGG(testing) AS array_agg FROM (SELECT js.key FROM json_each_text('{"5": 3, "9": 12}') AS js) AS testing) AS char_ids]), (SELECT id FROM new_id);
  // WITH new_id as (INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness) VALUES ((SELECT MAX(reviews.id) FROM reviews) + 1, 9, 3, (SELECT EXTRACT(epoch FROM now())), 'hello I am a newer test', 'testing is so much fun yay testing woohooooo', true, false, 'me777', 'me777@gmail.com', 0) RETURNING id) INSERT INTO characteristic_reviews(id, characteristic_id, review_id) SELECT 19327577, (SELECT UNNEST(array_agg) FROM (SELECT ARRAY_AGG(testing) AS array_agg FROM (SELECT js.key FROM json_each_text('{"5": 3, "9": 12}') AS js) AS testing) AS char_ids), (SELECT id FROM new_id);

  // FOR TESTING ***
  // WITH new_id as (INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness) VALUES ((SELECT MAX(reviews.id) FROM reviews) + 1, 9, 3, (SELECT EXTRACT(epoch FROM now())), 'hello I am a newer test', 'testing is so much fun yay testing woohooooo', true, false, 'me777', 'me777@gmail.com', 0) RETURNING id) INSERT INTO characteristic_reviews(id, characteristic_id, review_id) SELECT 19327577, UNNEST(ARRAY_AGG((SELECT js.key::int FROM json_each_text('{"5": 3, "9": 12}') AS js))), (SELECT id FROM new_id);

  // SELECT UNNEST(array_agg) FROM (SELECT ARRAY_AGG(testing) AS array_agg FROM (SELECT js.key FROM json_each_text('{"5": 3, "9": 12}') AS js) AS testing) AS char_ids;
  // SELECT UNNEST(array_agg) FROM (SELECT ARRAY_AGG(testing) AS array_agg FROM (SELECT js.value FROM json_each_text('{"5": 3, "9": 12}') AS js) AS testing) AS rev_val;

  // SELECT UNNEST(array_agg) FROM (SELECT ARRAY_AGG(testing) AS array_agg FROM ((SELECT js.key::int FROM json_each_text('{"5": 3, "9": 12}') AS js)) AS testing) AS char_ids;
  // SELECT UNNEST(ARRAY_AGG(SELECT js.key::int FROM json_each_text('{"5": 3, "9": 12}') AS js));

  // SELECT JSON_BUILD_OBJECT(5, 3, 9, 12)

  // for (key in req.body.characteristics) {
    // keys.push(key);
    // values.push(value);
  // }

// Updates a review to show it was found helpful
  // Parameters:
    // review_id - INT, required id of review to update
  // Response: 204 (no content)
app.put('/reviews/:review_id/helpful', controllers.addHelpful);

// Updeates a review to show it was reported
  // Does not delete the review, just keeps it from being returned in GET request
  // Parameters:
    // review_id - INT, required id of review to update
  // Response: 204 (no content)
app.put('/reviews/:review_id/report', controllers.markReported);

app.listen(port, () => {
  console.log(`Reviews microservice listening on port ${port}`)
});

module.exports = app;

