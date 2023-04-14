const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World from Reviews Microservice!')
});

app.listen(port, () => {
  console.log(`Reviews microservice listening on port ${port}`)
});
