// TASK: Get data from console into program

// TASK: Send data to backend

import * as readline from 'readline';
import axios from 'axios';
import getmac from 'getmac';
import dotenv from 'dotenv';

dotenv.config()

const backendURL = process.env.BACKEND_URL

const callMac = () => {
  return getmac()
}

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const waitForInput = () => {
  rl.question('Input ID:\n', async (idNum) => {    
    const result = await axios.post(backendURL! + 'v1/checkin', {
      mac_address: callMac(),
      student_id: idNum,
      event_id: '1b8fa151-0c0d-4646-9e1c-68764040361a'
    });
    waitForInput()
  })
}

waitForInput()
