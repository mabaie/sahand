'use strict';
const UserModel = require('../../Models/user').UserModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const ParentModel = require('../../Models/parent').ParentModel;
const ExternalError = require('../../Models/Error/External');
const InternalError = require('../../Models/Error/Internal')
async function getParentController(req, res, next) {
    const id = req.body.valid.value;
    UserModel.findOne({
        userName: id,
    }).then(async (user) => {

        const profile = await ProfileModel.findOne({
            _id: user[0]._id
        }).catch(err => {
            throw new InternalError(4);
        });
        const parent = await ParentModel.findOne({
            _id: user[0]._id
        }).catch((err) => {
            if (err.is(2)) {
                res.json({
                    FirstName: user[0].fname,
                    LastName: user[0].lname,
                    FatherName: profile[0].faname,
                    ID: user[0].userName,
                    EducationalDegree: profile[0].degree,
                    Major: profile[0].major,
                    BirthDay: profile[0].birthday,
                    Job: profile[0].job,
                    Mobile: profile[0].mobile,
                    Email: profile[0].email,
                    HomeAddress:  '',
                    WorkAddress: '',
                    HomePhone:profile[0].homePhone?profile[0].homePhone:''
                });
            } else {
                throw err;
            }
        })
        res.json({
            FirstName: user[0].fname,
            LastName: user[0].lname,
            FatherName: profile[0].faname,
            ID: user[0].userName,
            EducationalDegree: profile[0].degree,
            Major: profile[0].major,
            BirthDay: profile[0].birthday,
            Job: profile[0].job,
            Mobile: profile[0].mobile,
            Email: profile[0].email,
            HomeAddress: parent[0][req.data._id] ? parent[0][req.data._id].haddress : '',
            WorkAddress: parent[0][req.data._id] ? parent[0][req.data._id].waddress : '',
            HomePhone:profile[0].homePhone?profile[0].homePhone:''
        });
    }).catch(async (err) => {
        console.log(err)
        if (err.is(2)) {
            return next(new ExternalError(21));
        } else {
            throw err;
        }
    });
}

module.exports = getParentController;