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
    });
    waitForInput()
  })
}

waitForInput()
