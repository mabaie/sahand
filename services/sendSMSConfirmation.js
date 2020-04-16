'use strict';
const axios = require('axios');
const configs = require('../configs');

async function sendSMSConfirmation(fname, lname, id, pass, to) {
    const req = axios.create({
        baseURL: 'http://RestfulSms.com/api',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const Token = await req.post('/Token', {
        "UserApiKey": configs.SMS_API_KEY,
        "SecretKey": configs.SMS_SECURITY_KEY
    }).catch(() => {
        
    });
    const message = `کاربر گرامی ${fname} ${lname}\n 
    اطلاعات شما در سامانه سهند وارد شده است. جهت راهنمایی برای دانلود اپلیکیشن به سایت https://imapp.ir مراجعه نمایید.
    نام کاربری و رمز عبور شما برای ورود به اپلیکیشن به صورت زیر است:
    نام کاربری: ${id}\n
    کلمه عبور: ${pass}\n
    `
    await req.post('/MessageSend', {
        "Messages": [message],
        "MobileNumbers": ['0' + to],
        "LineNumber": "50002015285433",
        "SendDateTime": "",
        "CanContinueInCaseOfError": "true"
    }, {
        headers: {
            'Content-Type': 'application/json',
            'x-sms-ir-secure-token': Token.data.TokenKey
        }
    }).catch((err) => {
        
    });
}

module.exports = sendSMSConfirmation;
