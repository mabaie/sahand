'use strict';
const ExternalError = require('../../Models/Error/External');
const InternalError = require('../../Models/Error/Internal');
const UserModel = require('../../Models/user').UserModel;
const ProfileModel = require('../../Models/profile').ProfileModel;

async function getStudentController(req, res, next) {
    const id = req.body.valid.value;
    UserModel.findOne({
        userName: id,
    }).then(async (user) => {
        const profile = await ProfileModel.findOne({
            _id: user[0]._id
        }).catch(err => {
            throw new InternalError(4);
        });
        res.json({
            FirstName: user[0].fname,
            LastName: user[0].lname,
            FatherName: profile[0].faname,
            ID: user[0].userName,
            BirthDay: profile[0].birthday,
            Mobile: profile[0].mobile,
            Email: profile[0].email,
            Grade: profile[0].grade,
            BirthPlace:profile[0].birthPlace,
            IssuePlace:profile[0].issuePlace,
            Religion: profile[0].religion,
            Mazhab: profile[0].mazhab,
            Citizenship: profile[0].citizenship,
            AcademicYear:profile[0].academic_year,
            Image:profile[0].image,
        });
    }).catch(async (err) => {
        
        if (err.is(2)) {
            return next(new ExternalError(21));
        } else {
            throw err;
        }
    });
}
module.exports = getStudentController;