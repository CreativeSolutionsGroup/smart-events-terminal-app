//#!/usr/bin/env node
// previous line is shebang but idk how it works

// test server to establish websocket connection

// imports
import https from 'https';
import fs from 'fs'; // unused?
import WebSocketServer from 'websocket'; // unused?
import express from 'express';
import expressWs from 'express-ws'; // unused?
import dotenv from 'dotenv';

// build server
dotenv.config();
let app = express();
const port = process.env.PORT ?? 3001;
let server = https.createServer(app); 
expressWs(app, server);

app.use((req, res, next) => {
    console.log('Success!!');
    next();
});

app.listen();