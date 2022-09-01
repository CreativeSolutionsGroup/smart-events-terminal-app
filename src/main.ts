import ws from 'ws';
import * as readline from 'readline';
import axios from 'axios';
import getmac from 'getmac';
import dotenv from 'dotenv';
import { Heartbeat } from './models/Heartbeat';
import { Checkin } from './models/Checkin';

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
    waitForInput()
    sendCheckIn({
      mac_address: callMac(),
      student_id: idNum
    }, 1)
  })
}

//Sends a checkin until the backend recieves it
const sendCheckIn = async (checkin: Checkin, backoff: number) => {
  try {
    const result = await axios.post('/checkin', checkin);
  } catch (error) {
    await new Promise(f => setTimeout(f, backoff * 1000));
    backoff *= 2
    if (backoff > 128) { backoff = 128 }
    sendCheckIn(checkin, backoff)
  }
}

waitForInput()