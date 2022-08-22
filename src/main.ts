import ws from 'ws';

// Build client node
let client = new ws('ws://localhost:3001/heartbeat');

// Define functions for client node
client.on('open', () => {
    setInterval(() => {
        client.send('RPI 1: Still breathing. Runtime: ' + Date.now());
    }, 1000)
});

client.on('close', () => {
    client.send('Dead');
});