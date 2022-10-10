import ws from 'ws';
import * as readline from 'readline';
import axios, { AxiosError } from 'axios';
import getmac from 'getmac';
import dotenv from 'dotenv';
import { Heartbeat } from './models/Heartbeat';
import { Checkin } from './models/Checkin';
import { initialize_database } from './services/orm';
import { delete_check_in, insert_check_in } from './services/checkin';

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
    const check_in = new Checkin();
    check_in.mac_address = getmac()
    if (idNum.length === ID_LENGTH) {
      if (!isNaN(Number(idNum))) {
        check_in.student_id = idNum
        insert_check_in(check_in)
      }
    } else if (idNum.length > ID_LENGTH) {
      const modId = idNum.slice(-ID_LENGTH);
      if (!isNaN(Number(modId))) {
        check_in.student_id = modId
        insert_check_in(check_in)
      }
    }
  })
}

const read_cache = async () => {
  const cache = await Checkin.find()
  await Promise.all(cache.map(async (checkin) => {
    await send_check_in(checkin)
  }))
}

const cache_observer = () => {
  let is_resolved = true
  setInterval(async () => {
    if (is_resolved) {
      is_resolved = false
      await read_cache()
      is_resolved = true
    }
  }, (30 * 1000))
}


//Sends a checkin until the backend recieves it
const send_check_in = async (checkin: Checkin) => {
  try {
    await axios.post('/checkin', checkin)
    await delete_check_in(checkin.student_id)
  }
  catch (error: any) {
    const status = error.toJSON().status
    if (status >= 500 || status === null) {
      console.log(status + " trying to resend next cycle");
    } else if (status == 409) {
      await delete_check_in(checkin.student_id)
    }
  }
}

build_heartbeat(0)
wait_for_input()
cache_observer()