import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      duration: '60s',
      rate: 1000,
      timeUnit: '1s',
      preAllocatedVUs: 10,
      maxVUs: 1500,
    },
  },
};

export default function () {
  // Range for ProductIds -- approx. last 10% of reviews table
  let min = 900009;
  let max = 1000011;
  let productId = Math.floor(Math.random() * (max - min + 1) + min);
  // GET for /reviews
  // const res = http.get(`http://localhost:3003/reviews/?product_id=${productId}`);
  // GET for /reviews/meta
  const res = http.get(`http://localhost:3003/reviews/meta/?product_id=${productId}`);

  sleep(1);
  const checkRes = check(res, {
    'Status is 200' : (r) => r.status === 200,
  });
};