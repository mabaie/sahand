'use strict'
const configs = require('../configs');
const nodemailer = require('nodemailer');

function sendMail(to, subject, body) {
    const mailOptions = {
        from: configs.mail.addr,
        to: to,
        subject: subject,
        html: body
    };
    delete configs.addr;
    const transporter = nodemailer.createTransport(configs.mail);
    return new Promise(function (accept, reject) {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            }
            else {
                accept();
            }
        });
    })
}
module.exports = sendMail;