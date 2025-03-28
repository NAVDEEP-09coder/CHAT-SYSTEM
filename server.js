const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve single HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Get IP address
const os = require('os');
const interfaces = os.networkInterfaces();
let ipAddress;
Object.keys(interfaces).forEach((ifname) => {
    interfaces[ifname].forEach((iface) => {
        if ('IPv4' === iface.family && !iface.internal) {
            ipAddress = iface.address;
        }
    });
});

const PORT = 3001; // ← Change this to 3001

server.listen(PORT, () => {
    console.log(`Server running at:
- Local: http://localhost:${PORT}
- Network: http://${ipAddress}:${PORT}`);
});