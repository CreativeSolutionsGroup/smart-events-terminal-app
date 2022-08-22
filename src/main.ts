import ws from 'ws';
import * as readline from 'readline';

// Build client node
let client = new ws('ws://localhost:3001/heartbeat');

// Define functions for client node
client.on('open', () => {
    setInterval(() => {
        client.send('RPI 1: Still breathing. Runtime: ' + Date.now());
    }, 1000)
});

client.on('close', () => {
    client.send('Dead');
});

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Input ID:\n', (idNum) => {console.log(idNum)})