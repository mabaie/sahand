'use strict';
const CourseModel = require('../../Models/course').CourseModel;
const ObjectID = require('mongodb').ObjectID;
const UserModel = require('../../Models/user').UserModel;
async function getStudentsController(req, res, next) {
    const course = await CourseModel.findOne({
        _id: new ObjectID(req.params.id)
    }, 0, 10000)
    let students = [];
    if (course[0].students) {
        students = await UserModel.find({
            _id: {$in: course[0].students.map(stdid=>new ObjectID(stdid))}
        }, 0, 10000, {_id: 1,fname: 1, lname: 1, userName: 1})
        res.json(students);
    } else {
        res.json([]);
    }
}

module.exports = getStudentsController;