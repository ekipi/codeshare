const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const db = require('./dbs')
const bodyParser = require('body-parser');
const globals = require('./globals')
const ObjectID = require('mongodb').ObjectID
const morgan = require('morgan');
const logger = require('./logger');
const path = require('path');
const cron = require('node-cron');

const PORT = process.env.PORT || globals.PORT;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

cron.schedule('0 0 */2 * * *', () => {
    logger.info(`running a task to delete old sessions every two hours`);
    const collection = db.get().collection('sessions')
    const date = new Date();
    let deleteCounter = 0;
    date.setDate(date.getDate() - 1);
    collection.find({}).forEach(function (session) {

        let timeDiff = Math.abs(new Date(session.createdDate) - date);
        let diffHours = Math.ceil(timeDiff / (1000 * 3600));
        logger.info(`Difference in hours is ${diffHours}`)
        if (diffHours > 24) {
            try {
                collection.deleteOne({
                    "_id": session._id
                });
                deleteCounter++;
            } catch (e) {
                logger.info(`Error in deleting ${e}`)
            }
        }
    }, (err, docs) => {
        logger.info(`Deleted ${deleteCounter} documents`);
    })
});

app.use(morgan('common', {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: process.stderr
}));

app.use(morgan('common', {
    skip: function (req, res) {
        return res.statusCode >= 400
    },
    stream: process.stdout
}));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/dist/'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.use('/api', require('./controllers/sessions'))


io.on('connection', (socket) => {
    let client_id = socket.id
    logger.info(`${client_id} connected`);
    // once a client has connected, get the session id from client
    let session = ''
    socket.on('session', (sessionId) => {
        logger.info(`Session ID is ${sessionId}`);
        socket.join(sessionId);
        session = sessionId;
    });
    socket.on('content', (content) => {
        logger.info(`Session id is ${session}`);
        const collection = db.get().collection('sessions')
        collection.updateOne({
            // '_id': ObjectID(session) -- comented for shortid
            '_id': session
        }, {
            $set: {
                content: content
            }
        }, (err, docs) => {
            if (err) {
                logger.error(`${err}`);
            } else {
                logger.info(`Data with session id ${session} is updated with the latest editor content.`);
            }
        })
        io.sockets.in(session).emit('content', content);
    })
    //Upon disconnection, display a message in the log
    socket.on('disconnect', () => {
        logger.info(`${client_id} disconnected`);
    });
})

db.connect(globals.DB_URL + globals.DBNAME, (err) => {
    if (err) {
        logger.error(`Unable to connect to Mongo. Reason: ${err}`);
        process.exit(1)
    } else {
        server.listen(PORT, () => {
            logger.info(`Server is listening on port ${PORT}`)
        })
    }
})