const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan');
const port = process.env.PORT || 3000;
const request = require('request');

let STATUS = 'Free';

// app.use(morgan('combined'))
app.use(morgan('[:date[web]] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/free', (req, res) => {
  STATUS = 'Free';
  res.send('Done!');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
  socket.on('update', msg => {
    STATUS = msg;
    socket.broadcast.emit('update', msg);
  });
});

io.sockets.on('connection', socket => {
    socket.emit('update', STATUS);
});

http.listen(port, () => {
  console.log('Is The Toilet Free is online!');
});

setInterval(() => {
  request('http://127.0.0.1', (error, response, body) => {
    console.log('self request');
  });
}, 1000*60*5);
