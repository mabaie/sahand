'use strict';
const CourseModel = require('../../../Models/course').CourseModel;
const UserModel = require('../../../Models/user').UserModel;
const ObjectID = require('mongodb').ObjectID;
const ExternalError = require('../../../Models/Error/External');

module.exports = async function (req, res, next) {
    const body = req.body.valid.value;
    try {
        const course = await CourseModel.findOne({ _id: new ObjectID(body.courseID) })
        let students = await Promise.all(course[0].students.map(async student => {
            let retStudent = { ID: student };
            const user = await UserModel.findOne({ _id: new ObjectID(student) });
            retStudent['firstName'] = user[0].fname;
            retStudent['lastName'] = user[0].lname;
            return retStudent
        }))
        res.json({ studentList: students });
    } catch (err) {
        if (err.is(2)) {
            return next(new ExternalError(25))
        }
    }
}