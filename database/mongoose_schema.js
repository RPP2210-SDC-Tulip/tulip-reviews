const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
  review_id: { type: Number, required: true, unique: true },
  product_id: { type: String, required: true },
  rating: Number,
  summary: String,
  body: String,
  response: String,
  recommend: Boolean,
  name: String,
  email: String,
  photos: [{
    id: { type: Number, required: true, unique: true },
    url: String
  }],
  date: String,
  helpful: Number,
  reported: { type: Boolean, default: false },
  characteristics: {
    size_value: String,
    width_value: String,
    comfort_value: String,
    quality_value: String,
    length_value: String,
    fit_value: String }
});

const Reviews = mongoose.model('Reviews', reviewsSchema);

const reviewsMetaSchema = new mongoose.Schema({
  product_id: { type: Number, required: true, unique: true },
  ratings: {
    1: String,
    2: String,
    3: String,
    4: String,
    5: String
  },
  recommended: {
    false: String,
    true: String
  },
  characteristics: {
    size_id: Number,
    size_value: String,
    width_id: Number,
    width_value: String,
    comfort_id: Number,
    comfort_value: String,
    quality_id: Number,
    quality_value: String,
    length_id: Number,
    length_value: String,
    fit_id: Number,
    fit_value: String
  }
});

const Reviews_Meta = mongoose.model('Reviews_Meta', reviewsMetaSchema);
