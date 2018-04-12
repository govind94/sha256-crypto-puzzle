const express = require('express');
const shajs = require('sha.js');
const randomBinary = require('random-binary');
const hexToBinary = require('hex-to-binary');

const PORT = process.env.PORT || 8080;
const app = express();
var NUMBER_OF_BITS_FOR_M = 1000;

app.use((req, res, next) => {
  let B, arr = [];
  for(B = 1; B < 4; B++) {
    console.log(`\n#bytes = ${B}`);
    let NUMBER_OF_BITS_FOR_P = 8 * B;
    let sum = 0;
    for(let i = 0; i < 5; i++) {
      let P = randomBinary(NUMBER_OF_BITS_FOR_P);
      let count;
      console.time('timeTaken');
      for(count = 0; ; count++) {
        let M = randomBinary(NUMBER_OF_BITS_FOR_M);
        let shaMHex = shajs('sha256').update(M).digest('hex');
        let shaMBinary = hexToBinary(shaMHex);
        let shaMBinaryLastB = shaMBinary.substring(shaMBinary.length-NUMBER_OF_BITS_FOR_P);
        if(P === shaMBinaryLastB) break;
        if(count % 10000000 === 0) {
          NUMBER_OF_BITS_FOR_M = Math.floor(Math.random() * 256 + 1);
          console.log(NUMBER_OF_BITS_FOR_M);
        }
      }
      console.log(i, NUMBER_OF_BITS_FOR_M, P);
      console.timeEnd('timeTaken');
      sum += count/5;
    }
    arr.push(sum);
  }
  console.log("Fiiiinnnnaaaallllllyyyyy!", arr);
  res.locals.arr = arr;
  next();
});

app.get('/', (req, res) => {
  res.send({
    message: "If I show up, it's a good thing!",
    array: res.locals.arr
  });
});

app.listen(PORT, () => {
  console.log("Server running...");
});
