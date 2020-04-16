'use strict'

const User = require('../../Models/user').User;
const UserModel = require('../../Models/user').UserModel;
const Profile = require('../../Models/profile').Profile;
const Parent = require('../../Models/parent').Parent;
const ExternalError = require('../../Models/Error/External');
const bcrypt = require('bcrypt');
const generatePass = require('../../services/generatePass');
const sendMail = require('../../services/sendMail');
const InternalError = require('../../Models/Error/Internal');
const axios = require('axios');
const configs = require('../../configs');
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
        
        throw new InternalError(5);
    })
}
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
    const message = `کاربر گرامی ${fname} ${lname}\n ثبت نام شما با موفقیت انجام شد. \n نام کاربری: ${id}\n کلمه‌ی عبور: ${pass}`;
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
async function ParentController(req, res, next) {


        const body = req.body.valid.value;
        UserModel.findOne({
            userName: body.ID,
        }).then(() => {
            return next(new ExternalError(13));
        }).catch(async (err) => {
            if (err.is(2)) {
                try {
                    if (!(body.Password)) {
                        body.Password = generatePass();
                    }
                    await sendConfirmation(body.FirstName, body.LastName, body.ID, body.Password, body.Email);
                    sendSMSConfirmation(body.FirstName, body.LastName, body.ID, body.Password, body.Mobile);
                    const hashedPass = await bcrypt.hash(body.Password, 10);
                    const newUser = new User({
                        userName: body.ID,
                        pass: hashedPass,
                        fname: body.FirstName,
                        lname: body.LastName,
                        canLogin: true,
                        isActive: false,
                        modified_at: new Date(),
                        last_login: new Date(),
                        firstLogin: true,
                        type: {['parent']: true}
                    });
                    await newUser.save();
                    let profileRecord = {
                        _id: newUser.getId(),
                        faname: body.FatherName,
                        degree: body.EducationalDegree,
                        major: body.Major,
                        job: body.Job,
                        birthday: new Date(body.BirthDay),
                        mobile: body.Mobile,
                        email: body.Email,
                        modified_at: new Date(),
                    }
                    const newProfile = new Profile(profileRecord);
                    await newProfile.save();
                    let parentRecord = {
                        modified_at: new Date(),
                        school_id: req.data._id,
                        haddress: body.HomeAddress,
                        waddress: body.WorkAddress,
                        _id: newUser.getId(),
                    }
                    const newParent = new Parent(parentRecord);
                    await newParent.save();
                    return next(new ExternalError(15));
                } catch (err) {
                    
                    if (err.is(5)) {
                        return next(new ExternalError(26));
                    }
                    return next(new ExternalError(14));
                }
            } else {
                throw err;
            }
        });
    }

module.exports = ParentController;