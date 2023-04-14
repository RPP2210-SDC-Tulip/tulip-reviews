// const filename = require('./filename');

// Hard coding the function here for now
const sum = function(a, b) {
  return a + b;
}

test('Expects 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});