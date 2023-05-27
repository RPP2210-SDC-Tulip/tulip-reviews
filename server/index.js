require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3003;
const controllers = require('./controllers.js');
require('dotenv').config();

const myLoaderToken = process.env.MY_LOADER_TOKEN;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get(`/${myLoaderToken}/`, (req, res) => {
  res.send(myLoaderToken);
})

app.get('/reviews/', controllers.getProductReviews);

app.get('/reviews/meta', controllers.getReviewsMeta);

app.post('/reviews', controllers.addReview);

app.put('/reviews/:review_id/helpful', controllers.addHelpful);

app.put('/reviews/:review_id/report', controllers.markReported);

app.listen(port, () => {
  console.log(`Reviews microservice listening on port ${port}`)
});

module.exports = app;
