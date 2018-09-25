const MongoClient = require('mongodb').MongoClient
const globals = require('../globals')


let connect = (url, done) => {
    if (globals.CONNECTION.db) return done()
    MongoClient.connect(url, {
        useNewUrlParser: true
    }, (err, client) => {
        if (err) return done(err)
        globals.CONNECTION.db = client.db('ekipi_local')
        done()
    })
}

let get = () => {
    return globals.CONNECTION.db
}

let close = (done) => {
    if (globals.CONNECTION.db) {
        globals.CONNECTION.db.close((err, result) => {
            globals.CONNECTION.db = null
            globals.CONNECTION.mode = null
            done(err)
        })
    }
}

module.exports = {
    connect,
    get,
    close
}