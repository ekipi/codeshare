const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const db = require('./dbs')
const bodyParser = require('body-parser');
const globals = require('./globals')

const PORT = process.env.PORT || 4200;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies
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
        console.log("Session id: " + session);
        io.sockets.in(session).emit('content', content);
    })
    //Upon disconnection, display a message in the log
    socket.on('disconnect', () => {
        console.log(`${client_id} disconnected`);
    });
})

db.connect(globals.DB_URL, (err) => {
    if (err) {
        console.log('Unable to connect to Mongo.')
        process.exit(1)
    } else {
        server.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`)
        })
    }
})