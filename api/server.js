

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
// const { exec } = require('child_process');
const { spawn } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

app.use(express.static(__dirname + '/public'));  // Serve the Angular app

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('run command', (cmd) => {
        console.log('command received: ' + cmd);
        const command = "tidal-dl";//parts[0];
        const child = spawn(command, ["-l", cmd]);

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            //if (!data.includes('%')) {
                io.emit('command response', `stdout: ${data}`);
            //}
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            socket.emit('Error', `stderr: ${data}`);
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            socket.emit('command response', `Process exited with code ${code}`);
        });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
