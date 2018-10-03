const express = require('express')
const router = express.Router()
const db = require('../dbs')
const ObjectID = require('mongodb').ObjectID
const shortid = require('shortid');
const logger = require('../logger');

router.get('/allsessions', (req, res) => {
    const collection = db.get().collection('sessions')
    collection.find().toArray((err, docs) => {
        res.json(docs);
    })
})

/* router.get('/deleteSessions', (req, res) => {
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
                res.json(`Error in deleting ${e}`)
            }
        }
    }, (err, docs) => {
        res.json(`Deleted ${deleteCounter} documents`);
    })
}) */

router.get('/session/:id', (req, res) => {
    const collection = db.get().collection('sessions')
    collection.findOne({
        // '_id': ObjectID(req.params.id) -- commented for short id
        '_id': req.params.id
    }, (err, docs) => {
        res.json(docs);
    })
})

router.post('/createSession', (req, res) => {
    const collection = db.get().collection('sessions')
    let sessionObject = req.body;
    sessionObject._id = shortid.generate(),
        collection.insertOne(sessionObject, (err, docs) => {
            if (err) {
                res.json(err)
            } else {
                res.json(docs.ops[0]);
            }
        })
})

router.get('/contactMessages', (req, res) => {
    const collection = db.get().collection('messages')
    collection.find().toArray((err, docs) => {
        res.json(docs);
    })
})

router.post('/contactMessage', (req, res) => {
    const collection = db.get().collection('messages')
    let messagesObject = req.body;
    collection.insertOne(messagesObject, (err, docs) => {
        if (err) {
            res.json(err)
        } else {
            res.json(docs.ops[0]);
        }
    })
})

module.exports = router