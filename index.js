const express = require('express');
const shajs = require('sha.js');
const randomBinary = require('random-binary');
const hexToBinary = require('hex-to-binary');

const app = express();
const NUMBER_OF_BITS_FOR_M = 1000;

app.use((req, res, next) => {
  // Different values of B: 1, 2, 4, 8, 16 bytes
  // loop for B goes here
  let B, arr = [];
  for(B = 1; B < 3; B *= 2) {
    let NUMBER_OF_BITS_FOR_P = 8 * B;
    // Number of trials: 1000 for B = 1, 2, 4; 10 or 20 for B = 8; 1 for B = 16
    // loop for no. of trials goes here
    let sum = 0;
    for(let i = 0; i < 1; i++) {
      let P = randomBinary(NUMBER_OF_BITS_FOR_P);
      let count;
      for(count = 0; ; count++) {
        let M = randomBinary(NUMBER_OF_BITS_FOR_M);
        let shaMHex = shajs('sha256').update(M).digest('hex');
        let shaMBinary = hexToBinary(shaMHex);
        let shaMBinaryLastB = shaMBinary.substring(shaMBinary.length-NUMBER_OF_BITS_FOR_P);
        console.log(i, P, shaMBinaryLastB);
        if(P === shaMBinaryLastB) break;
      }
      sum += count;
    }
    arr.push(sum);
  }
  console.log("Fiiiinnnnaaaallllllyyyyy!");
  res.locals.arr = arr;
  next();
});

app.get('/', (req, res) => {
  // res.send({
  //   sha256: shajs('sha256').update(MESSAGE).digest('hex'),
  //   randomBinary: randomBinary(NUMBER_OF_BITS)
  // });
  res.send({
    message: "If I show up, it's a good thing!",
    array: res.locals.arr
  });
});

app.listen('8080', () => {
  console.log("Server running...");
});
