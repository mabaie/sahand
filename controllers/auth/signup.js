'use strict';
const User = require('../../Models/user').User;
const UserModel = require('../../Models/user').UserModel;
const Profile = require('../../Models/profile').Profile;
const School = require('../../Models/school').School;
const ExternalError = require('../../Models/Error/External');
const bcrypt = require('bcrypt');
const generatePass = require('../../services/generatePass');
const sendConfirmation = require('../../services/sendConfirmation');
const sendSMSConfirmation = require('../../services/sendSMSConfirmation');

async function signUpController(req, res, next) {
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
                    type: {
                        [body.Type]: true
                    }
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
                    address: body.Address,
                    modified_at: new Date(),
                }
                if (!(profileRecord.job)) {
                    delete profileRecord.job;
                }
                const newProfile = new Profile(profileRecord);
                await newProfile.save();
                if (body.Type === 'manager') {
                    let schoolRecord = {
                        _id: newUser.getId(),
                        modified_at: new Date(),
                        sname: body.SchoolName,
                        stype: body.SchoolType,
                    }
                    const newSchool = new School(schoolRecord);
                    await newSchool.save();
                }
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

module.exports = signUpController;