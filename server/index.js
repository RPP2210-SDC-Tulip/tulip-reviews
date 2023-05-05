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
