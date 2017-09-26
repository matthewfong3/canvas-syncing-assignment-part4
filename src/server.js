const fs = require('fs');
const http = require('http');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(index);
  res.end();
};

const app = http.createServer(onRequest);

app.listen(port);

console.log(`listening on 127.0.0.1: ${port}`);

const io = socketio(app);

io.sockets.on('connection', (socket) => {
  console.log('started');

  socket.join('room1');

  socket.on('updateOnServer', (data) => {
    socket.broadcast.emit('updateOnClient', data);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log('Websocket server started');
