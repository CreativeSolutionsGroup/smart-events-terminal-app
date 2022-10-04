import ws from 'ws';
import * as readline from 'readline';
import axios from 'axios';
import getmac from 'getmac';
import dotenv from 'dotenv';
import { Heartbeat } from './models/Heartbeat';
import { Checkin } from './models/Checkin';
import { initialize_database } from './services/orm';

const ID_LENGTH = 5;

console.log(getmac());

dotenv.config();
initialize_database();

axios.defaults.baseURL = process.env.BACKEND_URL ?? "http://localhost:3001/v1";
const heartbeat_url = process.env.HEARTBEAT_URL ?? "ws://localhost:3001";

const build_heartbeat = async (backoff: number) => {
  await new Promise(f => setTimeout(f, backoff * 1000));
  // Build client node
  let client = new ws(`${heartbeat_url}/heartbeat`);
  //Bool is necessary to prevent sending after interval
  let clientOn = true

  //catch WS errors. This is a required function so that the app does not crash
  client.on('error', (error) => {
    backoff *= 2
    if (backoff > 128) { backoff = 128 } else if (backoff === 0) { backoff = 1 }
    console.log('WS error. Attempting Reconnect in ', backoff, ' seconds')
    clientOn = false
  })

  // Define functions for client node
  client.on('open', () => {
    client.send(JSON.stringify({
      mac_address: getmac()
    } as Heartbeat));

    //This function will still activate after the client closes so the Bool checks that the client is open still
    setInterval(() => {
      if (clientOn) {
        client.send(JSON.stringify({
          mac_address: getmac()
        } as Heartbeat));
      }
    }, 10000)
    backoff = 0
  });

  client.on('close', () => {
    build_heartbeat(backoff)
  });
}

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const wait_for_input = () => {
  rl.question('Input ID:\n', async (idNum) => {
    wait_for_input()
    if (idNum.length === ID_LENGTH) {  
      if (!isNaN(Number(idNum))) {
        send_check_in({
          mac_address: getmac(),
          student_id: idNum
        }, 1)
      }
    } else if (idNum.length > ID_LENGTH) {
      const modId = idNum.slice(-ID_LENGTH);     
      if (!isNaN(Number(modId))) {
        send_check_in({
          mac_address: getmac(),
          student_id: modId
        }, 1)
      }
    }
  })
}

//Sends a checkin until the backend recieves it
const send_check_in = async (checkin: Checkin, backoff: number) => {
  await axios.post('/checkin', checkin)
  .catch (async (error) => {
    const status = error.toJSON().status
    if (status >= 500 || status === null) {
      await new Promise(f => setTimeout(f, backoff * 1000));
      backoff *= 2
      if (backoff > 128) { backoff = 128 }
      send_check_in(checkin, backoff)
    }
  });
}

build_heartbeat(0)
wait_for_input()