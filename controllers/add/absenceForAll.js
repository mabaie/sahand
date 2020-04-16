"use strict";
const ObjectID = require("mongodb").ObjectID;
const CourseModel = require("../../Models/course").CourseModel;
const UserModel = require("../../Models/user").UserModel;
const moment = require('moment');

module.exports = async function (req, res, next) {
    const body = req.body.valid.value;
    const date = moment(body.date);
    const day = 'day' + (date.day() + 1 % 7);
    try {
        let students = await UserModel.find({
            userName: {
                $in: body.list
            }
        }, 0, 10000000, {
            _id: 1
        });
        students = students.map(student => student._id.toString());
        let courses = await CourseModel.find({
            students: {
                $all: students
            },
            [`periods.${day}`]: {
                $exists: true
            }
        }, 0, 1000000);
        await Promise.all([].concat.apply([], courses.map(course => {
            return course.periods[day].map((period, id)=>{
                let dateTime = moment(date.format('YYYY-MM-DD') +' '+ period.start,'YYYY-MM-DD HH:mm');
                course.attendance[dateTime.toISOString()] = [{
                    period: id,
                    registerTime: new Date(),
                    present: students
                }]
                return CourseModel.findOneAndUpdate({_id: new ObjectID(course._id)}, {$set: {['attendance']: course.attendance} },{upsert: false})
            })
        })));

        res.json({'success': 1});
    } catch (err) {
        return next(err)
    }
    next();
}