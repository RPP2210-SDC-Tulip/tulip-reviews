// const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../server/index.js');

describe('GET /reviews', () => {
  it('Should fetch data from the reviews table with the correct shape', (done) => {
    request(app)
      .get('/reviews')
      .query({product_id: 2})
      .end((err, res) => {
        // console.log(res.body);
        expect(res.statusCode).to.equal(200);
        expect(res.body.product).to.equal('2');
        expect(res.body.page).to.equal(1);
        expect(res.body.count).to.equal(5);
        expect(res.body.results.length).to.equal(5);
        expect(res.body.results[0].review_id).to.equal('3');
        expect(res.body.results[0].rating).to.equal(4);
        expect(res.body.results[0].summary).to.equal('I am liking these glasses');
        expect(res.body.results[0].recommend).to.equal(true);
        expect(res.body.results[0].response).to.equal(`Glad you're enjoying the product!`);
        expect(res.body.results[0].body).to.equal(`They are very dark.  But that's good because I'm in very sunny spots`);
        expect(typeof res.body.results[0].date).to.equal('string');
        expect(res.body.results[0].reviewer_name).to.equal('bigbrotherbenjamin');
        expect(res.body.results[0].helpfulness).to.equal('5');
        expect(res.body.results[0].photos.length).to.equal(0);
        done();
      });
  }).timeout(10000);

  it('Should fetch data from the reviews_photos table with the correct shape', (done) => {
    request(app)
      .get('/reviews')
      .query({product_id: 2})
      .end((err, res) => {
        // console.log(res.body.results[2]);
        expect(res.statusCode).to.equal(200);
        expect(res.body.product).to.equal('2');
        expect(res.body.results[2].review_id).to.equal('5');
        expect(res.body.results[2].photos.length).to.equal(3);
        expect(res.body.results[2].photos[2].id).to.equal(3);
        expect(res.body.results[2].photos[2].url).to.equal('https://images.unsplash.com/photo-1487349384428-12b47aca925e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80');
        done();
      });
    }).timeout(10000);

    // **TO-DO**  Add test for date formatting

    it('Should sort reviews by helpfulness', (done) => {
      request(app)
        .get('/reviews')
        .query({product_id: 999965, sort: 'helpful'})
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.product).to.equal('999965');
          expect(res.body.results[0].review_id).to.equal('5774690');
          expect(res.body.results[0].helpfulness).to.equal(26);
          expect(res.body.results[1].review_id).to.equal('5774687');
          expect(res.body.results[1].helpfulness).to.equal(15);
          expect(res.body.results[3].review_id).to.equal('5774689');
          expect(res.body.results[3].helpfulness).to.equal(3);
          done();
        });
      }).timeout(10000);

    it('Should sort reviews by newest', (done) => {
      request(app)
        .get('/reviews')
        .query({product_id: 999965, sort: 'newest'})
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.product).to.equal('999965');
          expect(res.body.results[0].review_id).to.equal('5774690');
          expect(res.body.results[0].date).to.equal('1605722348455'); // need to refactor later for expected date string format*
          expect(res.body.results[1].review_id).to.equal('5774691');
          expect(res.body.results[1].date).to.equal('1603455095097'); // need to refactor later for expected date string format*
          expect(res.body.results[3].review_id).to.equal('5774687');
          expect(res.body.results[3].date).to.equal('1589365485089'); // need to refactor later for expected date string format*
          done();
        });
      }).timeout(10000);

    // **TO-DO** Add test for relevant sorting

    it('Should not include data from the reviews table if a review was reported', (done) => {
      request(app)
        .get('/reviews')
        .query({product_id: 999971})
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.product).to.equal('999971');
          expect(res.body.results[2].review_id).to.equal('5774713'); // Note that id 5774712 is reported
          done();
        });
      }).timeout(10000);
});

// **TO-DO** ASK IN OFFICE HOUR HOW TO TEST INCREMENTING
describe('PUT /reviews/helpful', () => {
  it(`Should increment a review's helpfulness score by one`, (done) => {
    request(app)
      .put('/reviews/7392/helpful')
      .end((err, res) => {
        expect(res.statusCode).to.equal(204);
        done();
      });
  }).timeout(10000);
});
