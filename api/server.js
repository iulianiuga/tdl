const express = require('express');
const app = express();
const port = 9000;

const path = require('path');

//app.use('/', function (req, res) {
//  res.sendFile('./public/index.html', { 'root': __dirname });
//});

app
  .use(express.urlencoded({ extended: true, limit: '15mb' }))
  .use(express.json({ limit: '15mb' }))

app.post('/api/cmd', function (req, res) {
  console.log(req.body.cmd);
  var command = req.body.cmd;
  var exec = require('child_process').exec;
  exec(command, (error, stdout, stderr) => {
    res.status(200).send({ success: true, messages: [stdout] });
  });
  //res.status(200).send({ success: true, messages: ['bla bla bla1', 'bla bla bla2', 'bla bla bla3', 'bla bla bla4', 'bla bla bla5'] });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});