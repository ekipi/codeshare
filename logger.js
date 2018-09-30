const winston = require('winston');

const level = process.env.LOG_LEVEL || 'info';

let logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: level,
            timestamp: function () {
                return (new Date()).toISOString();
            }
        })
    ]
});


module.exports = logger