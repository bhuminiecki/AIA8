const io = require("socket.io");
const server = io.listen(7000);

server.on('connection', (socket) => {
  console.log('connected');
  socket.on('message', (message) => {
    server.emit('message', message);
  });
  socket.on('login', (name) => {
    console.log(name)
    socket.emit('loggedIn', true)
    socket.broadcast.emit('user', {user: name, socketId: socket.id});
  });
  socket.on('disconnect', function () {
    socket.broadcast.emit('disconnected', socket.id)
  })
});