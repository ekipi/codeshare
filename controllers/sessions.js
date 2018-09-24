const express = require('express'),
    router = express.Router()

const db = require('../dbs')

router.get('/allsessions', function (req, res) {
    const collection = db.get().collection('sessions')
    collection.find().toArray(function (err, docs) {
        res.json(docs);
    })
})

router.post('/createSession', (req, res) => {
    const collection = db.get().collection('sessions')
    let sessionObject = req.body.sessionObject;
    collection.insertOne(sessionObject, (err, docs) => {
        if (err) {
            res.json(err)
        } else {
            res.json(docs.ops[0]);
        }
    })
})

/* router.get('/recent', function (req, res) {
    const collection = db.get().collection('comments')

    collection.find().sort({
        'date': -1
    }).limit(100).toArray(function (err, docs) {
        res.render('comments', {
            comments: docs
        })
    })
}) */

module.exports = router