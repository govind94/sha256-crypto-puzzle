const express = require('express');
const shajs = require('sha.js');
const randomBinary = require('random-binary');

const MESSAGE = '10001';
const NUMBER_OF_BITS = 5;
const P_BYTES = 3 // 12? (4 * 3)
const app = express();

app.use((req, res, next) => {
  let messageHash = shajs('sha256').update(MESSAGE).digest('hex');
  let messageLastP = messageHash.substring(messageHash.length-P_BYTES);
  while(true) {
    let generateRandom = randomBinary(NUMBER_OF_BITS);
    let guessNumber = shajs('sha256').update(generateRandom).digest('hex');
    let guessLastP = guessNumber.substring(guessNumber.length-P_BYTES);
    console.log(generateRandom , guessLastP);
    if(guessLastP === messageLastP) {
      console.log("Fiiiinnnnaaaallllllyyyyy!");
      break;
    }
  }
  next();
})

app.get('/', (req, res) => {
  // res.send({
  //   sha256: shajs('sha256').update(MESSAGE).digest('hex'),
  //   randomBinary: randomBinary(NUMBER_OF_BITS)
  // });

  res.send("If I show up, it's a good thing!");
})

app.listen('8080', () => {
  console.log("Server running...");
})
