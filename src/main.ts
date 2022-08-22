// begin Heartbeat client pulse work stuff things

// imports, as opposed to exports
import https from 'https';
import fs from 'fs';
import WebSocketServer from 'websocket';
import ws from 'ws';

// relevant functions
function connect() {
    let serverUrl: string = "wss://localhost:3001"; // correct server url??
    let scheme: string = "wss";
}
// establish connection with backend
let url: string;
let protocol: string;
//let webSocket = new WebSocket(url, protocol);

// ws test
let client = new ws('ws://localhost:3001/heartbeat');
client.on('open', () => {
    // Causes the server to print "Hello"
    client.send('hi there');
});


// end heartbeat stuff things