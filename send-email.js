const nodemailer = require('nodemailer');
const globals = require('./globals')
const transport = nodemailer.createTransport({
    service: globals.EMAIL_SERVICE,
    auth: {
        user: globals.CONTACT_EMAIL,
        pass: globals.CONTACT_EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});
let sendEmail = (from, to, subject, message) => {
    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: message,
    };
    transport.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    });
};

module.exports = sendEmail;