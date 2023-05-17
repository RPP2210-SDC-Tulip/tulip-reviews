const pool = require('../database/index.js');

const getProductReviews = (req, res) => {
  // console.log('PRODUCT ID: ', req.query.product_id);
  var order = "helpfulness DESC"
  if (req.query.sort === "newest") {
    order = "date DESC"
  } else if (req.query.sort === "relevant") {
    order = "helpfulness DESC, date DESC"
  }

  pool.query(`SELECT id AS review_id, rating, summary, recommend, response, body, (SELECT TO_TIMESTAMP(date/1000) AS date), reviewer_name, helpfulness,
    (SELECT COALESCE (JSON_AGG(temporary_photos), '[]') FROM (SELECT id, url FROM reviews_photos WHERE reviews_photos.review_id = reviews.id)
    AS temporary_photos) AS photos
    FROM reviews WHERE product_id = ${req.query.product_id} AND reported = false ORDER BY ${order};`, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let result = {
        product: req.query.product_id,
        page: req.query.page || 1,
        count: req.query.count || 5,
        results: data.rows
      }
      res.status(200).send(result);
    }
  });
};

const getReviewsMeta = (req, res) => {
  // console.log('META PRODUCT ID: ', req.query.product_id);
  pool.query(`SELECT JSON_BUILD_OBJECT('product_id', ${req.query.product_id},
    'ratings', (SELECT JSON_OBJECT_AGG(rating, count)
      FROM (SELECT rating, COUNT(*) FROM reviews WHERE product_id = ${req.query.product_id}
      GROUP BY rating ORDER BY rating ASC) as ratings),
    'recommended', (SELECT JSON_OBJECT_AGG(recommend, count)
      FROM (SELECT recommend, COUNT(*) FROM reviews WHERE product_id = ${req.query.product_id}
      GROUP BY recommend) AS recommended),
    'characteristics', (SELECT JSON_OBJECT_AGG(name, char_detail.char_data)
      FROM (SELECT name, JSON_BUILD_OBJECT('id', char_avg.id, 'value', char_avg.value) AS char_data
      FROM (SELECT id, name, (SELECT AVG (value) FROM characteristic_reviews WHERE characteristic_id = characteristics.id) AS value
      FROM characteristics WHERE product_id = ${req.query.product_id} GROUP BY name, id) AS char_avg) AS char_detail));`, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(data.rows[0].json_build_object);
    }
  });
};

const addReview = (req, res) => {
  // console.log('REQ: ', req.body);
  var reqCharIds = [];
  var reqCharValues = [];
  for (var key in req.body.characteristics) {
    reqCharIds.push(Number(key));
    reqCharValues.push(Number(req.body.characteristics[key]));
  };

  // **TO-DO** Refactor query to work for special characters in text input data (ex. summary, body)
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
  });
};

const addHelpful = (req, res) => {
  // console.log('REQ: ', req.params.review_id);
  pool.query(`UPDATE reviews SET helpfulness =
    ((SELECT helpfulness FROM reviews WHERE id = ${req.params.review_id}) + 1)
    WHERE id = ${req.params.review_id};`, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.status(204).send('Helpfulness changed!');
    }
  });
};

const markReported = (req, res) => {
  // console.log('REQ: ', req.params.review_id);
  pool.query(`UPDATE reviews SET reported = true WHERE id = ${req.params.review_id}`, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.sendStatus(204);
    }
  });
};

module.exports.getProductReviews = getProductReviews;
module.exports.getReviewsMeta = getReviewsMeta;
module.exports.addReview = addReview;
module.exports.addHelpful = addHelpful;
module.exports.markReported = markReported;
