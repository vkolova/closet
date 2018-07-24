const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan');
const port = process.env.PORT || 3000;

// app.use(morgan('combined'))
app.use(morgan('[:date[web]] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
  socket.on('update', msg => {
    socket.broadcast.emit('update', msg);
  });
});

http.listen(port, () => {
  console.log('Is The Toilet Free is online!');
});
