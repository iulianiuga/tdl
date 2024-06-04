// const express = require('express');
// const app = express();
// const port = 9000;

// const path = require('path');

// //app.use('/', function (req, res) {
// //  res.sendFile('./public/index.html', { 'root': __dirname });
// //});

// app
//   .use(express.urlencoded({ extended: true, limit: '15mb' }))
//   .use(express.json({ limit: '15mb' }))

// app.post('/api/cmd', function (req, res) {
//   console.log(req.body.cmd);
//   var command = req.body.cmd;
//   var exec = require('child_process').exec;
//   exec(command, (error, stdout, stderr) => {
//     res.status(200).send({ success: true, messages: [stdout] });
//   });
//   //res.status(200).send({ success: true, messages: ['bla bla bla1', 'bla bla bla2', 'bla bla bla3', 'bla bla bla4', 'bla bla bla5'] });
// });

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { exec } = require('child_process');
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

app.use(express.static(__dirname + '/dist/your-angular-app'));  // Serve the Angular app

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/your-angular-app/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('run command', (cmd) => {
        console.log('command received: ' + cmd);
        const parts = cmd.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        const child = spawn(command, args);

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            socket.emit('command response', `stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            socket.emit('command response', `stderr: ${data}`);
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
