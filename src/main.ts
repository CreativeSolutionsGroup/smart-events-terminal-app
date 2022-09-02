import ws from 'ws';
import * as readline from 'readline';
import axios from 'axios';
import getmac from 'getmac';
import dotenv from 'dotenv';
import { Heartbeat } from './models/Heartbeat';
import { Checkin } from './models/Checkin';

dotenv.config()

axios.defaults.baseURL = process.env.BACKEND_URL ?? "http://localhost:3001/v1";
const heartbeat_url =  process.env.HEARTBEAT_URL ?? "ws://localhost:3001";

// Build client node
let client = new ws(`${heartbeat_url}/heartbeat`);

// Define functions for client node
client.on('open', () => {
  client.send(JSON.stringify({
    mac_address: getmac()
  } as Heartbeat));
  
  setInterval(() => {
    client.send(JSON.stringify({
      mac_address: getmac()
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
      mac_address: getmac(),
      student_id: idNum
    }, 1)
  })
}

//Sends a checkin until the backend recieves it
const sendCheckIn = async (checkin: Checkin, backoff: number) => {
  await axios.post('/checkin', checkin)
  .catch (async function (error) {
    const status = error.toJSON().status
    if (status >= 500 || status === null) {
      await new Promise(f => setTimeout(f, backoff * 1000));
      backoff *= 2
      if (backoff > 128) { backoff = 128 }
      sendCheckIn(checkin, backoff)
    }
  });
}

waitForInput()