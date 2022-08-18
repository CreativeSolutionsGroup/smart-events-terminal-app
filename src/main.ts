// begin Heartbeat client pulse work stuff things

// imported stuff, not sure which ones are really necessary
import https from 'https';
import fs from 'fs';
import WebSocketServer from 'websocket';

// establish connection with backend
let url: string;
let protocol: string;
let webSocket = new WebSocket(url, protocol);

// end heartbeat stuff things