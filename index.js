const express = require('express');
const shajs = require('sha.js');

const app = express();

app.get('/', (req, res) => {
  res.send('sha256 for networksecurity: ' + shajs('sha256').update('networksecurity').digest('hex'));
})

app.listen('8080', () => {
  console.log("Server running...");
})
