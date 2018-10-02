const express = require('express')
const router = express.Router()
const db = require('../dbs')
const ObjectID = require('mongodb').ObjectID
const shortid = require('shortid');

router.get('/allsessions', (req, res) => {
    const collection = db.get().collection('sessions')
    collection.find().toArray((err, docs) => {
        res.json(docs);
    })
})

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