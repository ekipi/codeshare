var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const PORT = process.env.PORT || 4200;

app.use(express.static(__dirname + '/node_modules'));

io.on('connection', (socket) => {
    let client_id = socket.id
    console.log(`${client_id} connected`);
    // once a client has connected, get the session id from client
    let session = ''
    socket.on('sessionId', (sessionId) => {
        socket.join(sessionId);
        session = sessionId;
    });
    socket.on('text', (text) => {
        io.sockets.in(session).emit('text', text);
    })
    //Upon disconnection, display a message in the log
    socket.on('disconnect', () => {
        console.log(`${client_id} disconnected`);
    });
})

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})