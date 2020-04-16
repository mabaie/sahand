'use strict';
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-jalaali');
const CourseModel = require('../../Models/course').CourseModel;
const UserModel = require('../../Models/user').UserModel;

module.exports = async function (req, res, next) {

    const date = moment(req.params.date);
    const classID = new ObjectID(req.params.id);
    try {
        const courses = await CourseModel.find({
            class_id: classID
        }, 0, 1000000, {
            attendance: 1,
            students: 1
        });
        let out = [];
        courses.map(course => {
            for (let session in course.attendance) {
                const sessionDate = moment(session);
                if (sessionDate.jDate() === date.jDate()) {
                    course.attendance[session].map(el => {
                        let difference = course.students.filter(x => !el.present.includes(x));
                        out = [...new Set([...out, ...difference])];
                    })
                }
            }
        })
        const abscents = await Promise.all(out.map(async abscent => (await UserModel.find({
            _id: new ObjectID(abscent)
        }, 0, 1000000, {
            fname: 1,
            lname: 1
        }))[0]));
        res.json(abscents);
        return out;
    } catch (err) {
        console.log(err);
    }
}