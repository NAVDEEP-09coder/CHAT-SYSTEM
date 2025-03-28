const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

wss.on('connection', (ws) => {
    const clientId = uuidv4();
    
    ws.send(JSON.stringify({
        type: 'init',
        clientId: clientId
    }));

    ws.on('message', (data) => {
        const msg = JSON.parse(data);
        
        const enhancedMsg = {
            text: msg.text,
            senderId: clientId, 
            timestamp: Date.now(),
            type: 'message'
        };
        
        wss.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(enhancedMsg));
            }
        });
    });
});

server.listen(9000, '0.0.0.0', () => {
    console.log('Server: http://localhost:9000');
    console.log('Install UUID: npm install uuid');
});