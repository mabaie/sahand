'use strict';
const InternalError = require('../Models/Error/Internal');
const sendMail = require('./sendMail');

async function sendConfirmation(fname, lname, id, pass, to) {
    return sendMail(to, 'تأیید ثبت نام',
        `<p dir='rtl'>
        کاربر گرامی ${fname} ${lname} ثبت نام شما با موفقیت انجام شد.
        <br />
        نام کاربری شما: ${id}
        <br />
        کلمه‌ی عبور شما: ${pass}
     </p>
    `).catch((err) => {
        console.log(err)
        throw new InternalError(5);
    })
}

module.exports = sendConfirmation;