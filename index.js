const express = require('express');
const shajs = require('sha.js');
const randomBinary = require('random-binary');
const hexToBinary = require('hex-to-binary');

const PORT = process.env.PORT || 8080;
const app = express();
var NUMBER_OF_BITS_FOR_M;

app.use((req, res, next) => {
  let B, arr = []; // 'arr' stores avg count for each 'B'
  for(B = 1; B < 5; B++) {
    console.log(`\n#byte(s) = ${B}`);
    let NUMBER_OF_BITS_FOR_P = 8 * B; // get #bits
    NUMBER_OF_BITS_FOR_M = 256;
    let sum = 0;
    console.time('totalTimeTaken');  // record total time
    for(let i = 1; i <= 1000; i++) { // #trials
      let P = randomBinary(NUMBER_OF_BITS_FOR_P);
      let count;
      console.time('timeTakenPerTrial'); // record time per trial
      for(count = 1; ; count++) { // keep count of each trial
        let M = randomBinary(NUMBER_OF_BITS_FOR_M);
        let shaMHex = shajs('sha256').update(M).digest('hex');
        let shaMBinary = hexToBinary(shaMHex);
        let shaMBinaryLastB = shaMBinary.substring(shaMBinary.length-NUMBER_OF_BITS_FOR_P);
        if(P === shaMBinaryLastB) break;
        if(count % 10000000 === 0) { // change #bits of M after every 10000000 attempt
          NUMBER_OF_BITS_FOR_M = Math.floor(Math.random() * 256 + 1);
          console.log(`Number of bits for M changed to: ${NUMBER_OF_BITS_FOR_M}`);
        }
      }
      console.log(i, NUMBER_OF_BITS_FOR_M, P, count);
      console.timeEnd('timeTakenPerTrial'); // save time per trial
      sum += count/1000;
    }
    arr.push(sum);
    console.timeEnd('totalTimeTaken'); // save total time
  }
  console.log("\nAverage count: ", arr);
  res.locals.arr = arr;
  next();
});

app.get('/', (req, res) => {
  res.send({
    message: "If I show up, it's a good thing!",
    countArray: res.locals.arr
  });
});

app.listen(PORT, () => {
  console.log("Server running...");
});
