// TASK: Get data from console into program

import * as readline from 'readline';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Input ID:\n', (idNum) => {console.log(idNum)})