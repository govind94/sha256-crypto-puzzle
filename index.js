const express = require('express');
const shajs = require('sha.js');
const randomBinary = require('random-binary');

const MESSAGE = '10001';
const NUMBER_OF_BITS = 5;
const app = express();

app.get('/', (req, res) => {
  res.send({
    sha256: shajs('sha256').update(MESSAGE).digest('hex'),
    randomBinary: randomBinary(NUMBER_OF_BITS)
  });
})

app.listen('8080', () => {
  console.log("Server running...");
})
