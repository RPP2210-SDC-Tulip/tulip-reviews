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
    // characteristics - {"characteristic_id": review_value}
  // Response: 201
app.post('/reviews', (req, res) => {
});
// POSTS to reviews table
// INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness) VALUES ((SELECT MAX(reviews.id) FROM reviews) + 1, 9, 3, (SELECT EXTRACT(epoch FROM now())), 'hello I am a test', 'testing is so much fun yay testing', true, false, 'me', 'me@gmail.com', 0);
// WITH new_review_id as ( RETURNING id) INSERT INTO reviews_photos(id, review_id, url) VALUES ((SELECT MAX(reviews_photos.id) FROM reviews_photos) + 1, review_id, 'testingtestingtesting')
// Allows inserting photos as well: -- currently for single url...will need to refactor for the full array
  // WITH new_id as (INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness) VALUES ((SELECT MAX(reviews.id) FROM reviews) + 1, 9, 3, (SELECT EXTRACT(epoch FROM now())), 'hello I am a test', 'testing is so much fun yay testing', true, false, 'me', 'me@gmail.com', 0) RETURNING id) INSERT INTO reviews_photos(id, review_id, url) VALUES ((SELECT MAX(reviews_photos.id) FROM reviews_photos) + 1, (SELECT id FROM new_id), 'testingtestingtesting');

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

