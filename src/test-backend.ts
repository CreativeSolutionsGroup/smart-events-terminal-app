//#!/usr/bin/env node
// previous line is shebang but idk how it works

// test server to establish websocket connection

// imports
import https from 'https';
import fs from 'fs'; // unused?
import WebSocketServer from 'websocket'; // unused?
import express from 'express';
import expressWs from 'express-ws';

// build server
let app = express();
const port = process.env.PORT ?? 3001;
const server = expressWs(app);

server.app.ws('/heartbeat', (server, req, res) => {
    server.on('message', (message: string) => {
        console.log(message);
    });
    server.on('close', () => {
        console.log('RPI dead');
    });
});

console.log('Listening on port ' + port);
app.listen(port);