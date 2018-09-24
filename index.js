var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var db = require('./dbs')

var bodyParser = require('body-parser');

const PORT = process.env.PORT || 4200;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/node_modules'));
app.use('/api', require('./controllers/sessions'))


io.on('connection', (socket) => {
    let client_id = socket.id
    console.log(`${client_id} connected`);
    // once a client has connected, get the session id from client
    let session = ''
    socket.on('session', (sessionId) => {
        console.log(`Session ID is ${sessionId}`)
        socket.join(sessionId);
        session = sessionId;
    });
    socket.on('content', (content) => {
        console.log("Text received ::: " + content)
        console.log("Session id: " + session);
        io.sockets.in(session).emit('content', content);
    })
    //Upon disconnection, display a message in the log
    socket.on('disconnect', () => {
        console.log(`${client_id} disconnected`);
    });
})

db.connect('mongodb://localhost:27017/ekipi_local', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    server.listen(PORT, function() {
      console.log(`Server is listening on port ${PORT}`)
    })
  }
})
/* server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
}) */