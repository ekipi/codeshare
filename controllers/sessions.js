const express = require('express')
const router = express.Router()
const db = require('../dbs')
const ObjectID = require('mongodb').ObjectID

router.get('/allsessions', (req, res) => {
    const collection = db.get().collection('sessions')
    collection.find().toArray((err, docs) => {
        res.json(docs);
    })
})

router.get('/session/:id', (req, res) => {
    const collection = db.get().collection('sessions')
    collection.findOne({
        '_id': ObjectID(req.params.id)
    }, (err, docs) => {
        res.json(docs);
    })
})

router.post('/createSession', (req, res) => {
    const collection = db.get().collection('sessions')
    let sessionObject = req.body;
    console.log(req.body);
    collection.insertOne(sessionObject, (err, docs) => {
        if (err) {
            res.json(err)
        } else {
            res.json(docs.ops[0]);
        }
    })
})

module.exports = router