import ws from 'ws';
import * as readline from 'readline';
import axios from 'axios';
import getmac from 'getmac';
import dotenv from 'dotenv';
import { Heartbeat } from './models/Heartbeat';

dotenv.config()

const callMac = () => {
  return getmac()
}

axios.defaults.baseURL = process.env.BACKEND_URL;

// Build client node
let client = new ws('ws://localhost:3001/heartbeat');

// Define functions for client node
client.on('open', () => {
  client.send(JSON.stringify({
    mac_address: callMac()
  } as Heartbeat));
  
  setInterval(() => {
    client.send(JSON.stringify({
      mac_address: callMac()
    } as Heartbeat));
  }, 10000)
});

client.on('close', () => {
  client.send('Dead');
});

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const waitForInput = () => {
  rl.question('Input ID:\n', async (idNum) => {
    const result = await axios.post('/checkin', {
      mac_address: callMac(),
      student_id: idNum,
    });
    waitForInput()
  })
}

waitForInput()
