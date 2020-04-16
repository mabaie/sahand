'use strict'
const ObjectID = require('mongodb').ObjectID;
const ParentModel = require('../../Models/parent').ParentModel;
const UserModel = require('../../Models/user').UserModel;
const TeacherModel = require('../../Models/teacher').TeacherModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const ChildModel = require('../../Models/children').ChildrenModel;
const External = require('../../Models/Error/External');
const sendMail = require('../../services/sendMail');
const generatePass = require('../../services/generatePass');
const InternalError = require('../../Models/Error/Internal');
const axios = require('axios');
const bcrypt = require('bcrypt');
const configs = require('../../configs')
const fs = require('fs');
async function sendConfirmation(fname, lname, id, pass, to) {
    console.log('********************************* ',fname, lname, id, pass, to)
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
    const message = `کاربر گرامی ${fname} ${lname}\n ثبت نام شما در سامانه سهند از طرف پیش دبستان و دبستان دی با موفقیت انجام شد. \n نام کاربری: ${id}\n کلمه‌ی عبور: ${pass}\n برای اطلاعات بیشتر به وب سایت imapp.ir مراجعه نمایید.`;
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
module.exports = async function (req, res, next) {
    const managerID = new ObjectID(req.data._id);
    // const parents = await findParents(managerID);
    try {
        const parents = await ParentModel.find({
            [managerID]: {
                $exists: true
            }
        },0,10000).catch(err => {
            if (err.is(2)) {
                return undefined
            }
        });
        Promise.all(parents.map(async (parent)=>{
        try{
            let password = generatePass();
            const hashedPass = await bcrypt.hash(password, 10);
            let user=await UserModel.findOneAndUpdate({
                _id: parent._id,
            }, {
                $set: {pass:hashedPass,firstLogin:true},
                $currentDate: {
                    last_modified: true
                },
            }, {
                upsert: false,
            })
            let child = await ChildModel.findOne({ $or: [ { parentOne:parent._id },{ parentTwo:parent._id }] })
            const childDetail = await UserModel.findOne({_id:child[0]._id});
            const childProfile = await ProfileModel.findOne({_id: child[0]._id});
            fs.appendFile('password.txt',childDetail[0].fname+'\t'+childDetail[0].lname+'\t'
                        +childProfile[0].grade+'\t'
                        +user.fname +'\t'+ user.lname+'\t' + user.userName+'\t' +password+'\n',function(err) {
                            if(err) {
                                return console.log(err);
                            }
                            console.log("The file success was saved!");
                        })
            //let profile = await ProfileModel.findOne({_id: parent._id});
            //console.log('profile is : ',profile)
            //await sendConfirmation(user.fname, user.lname, user.userName, password, profile[0].email);
            //sendSMSConfirmation(user.fname, user.lname, user.userName, password, profile[0].mobile);
        }catch(err){

        }
        }));


        const teachers = await TeacherModel.find({
            [managerID]: {
                $exists: true
            }
        },0,10000).catch(err => {
            if (err.is(2)) {
                return undefined
            }
        });
        Promise.all(teachers.map(async (teacher)=>{
            try{
            let password = generatePass();
            const hashedPass = await bcrypt.hash(password, 10);
            let user=await UserModel.findOneAndUpdate({
                _id: teacher._id,
            }, {
                $set: {pass:hashedPass,firstLogin:true},
                $currentDate: {
                    last_modified: true
                },
            }, {
                upsert: false,
            })
            fs.appendFile('passwordTeacher.txt',user.fname +'\t'+ user.lname+'\t'+ user.userName+'\t' +password+'\n',function(err) {
                            if(err) {
                                return console.log(err);
                            }
                            console.log("The file success was saved!");
                        })
            // let profile = await ProfileModel.findOne({_id: teacher._id});
            // console.log('profile is : ',profile)
            // await sendConfirmation(user.fname, user.lname, user.userName, password, profile[0].email);
            //sendSMSConfirmation(user.fname, user.lname, user.userName, password, profile[0].mobile);
        }catch(err){

        }
    }));
        res.json({success:1});
    } catch (err) {
        if (err.is(2)) {
            return next(new External(25));
        }
    }
}