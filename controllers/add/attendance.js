'use strict';
const CourseModel = require('../../Models/course').CourseModel;
const ObjectID = require('mongodb').ObjectID;
const ExternalError = require('../../Models/Error/External');
const InternalError = require('../../Models/Error/Internal');
const moment = require('moment');
const _ = require('lodash');

module.exports = async function (req, res, next) {
    const body = req.body.valid.value;
    const course_id = req.params.course_id;
    try {
        let course = await CourseModel.findOne({ _id: new ObjectID(course_id) })
        course = course[0];
        let attendance = course['attendance'] ? course['attendance'] : {};
        let now = moment(new Date(body.date));
        const day = 'day' + ((now.day() + 1) % 7);
        now=now.add(5,'minutes');
        //now = moment(now.format('HH:mm'), 'HH:mm');
        if (!course.periods[day]) {
            throw new InternalError(9);
        }
        const periods = course.periods[day];
        let isTimeInPeriod = -1;
        let start;
        periods.map((period, id) => {
            start = moment(body.date.substr(0,10) + period.start, 'YYYY-MM-DDHH:mm');
            const end = moment(body.date.substr(0,10) + period.end, 'YYYY-MM-DDHH:mm');
            //const end = moment(period.end, 'HH:mm');
            console.log(start,end,now,now.isBetween(start, end))
            if (now.isBetween(start, end)) {
                isTimeInPeriod = id;
                if(!attendance[start.toISOString()]){
                    attendance[start.toISOString()] = [];
                }
                let sessionAttendance = {
                    period: id,
                    registerTime: new Date(),
                    present: []
                }
                body['present'].map(student => {
                    if (course.students.indexOf(student) === -1) {
                        throw new InternalError(10);
                    }
                    sessionAttendance['present'] = _.union(sessionAttendance['present'], [student]);
                })
                let foundSession = attendance[start.toISOString()].findIndex(session=>{
                    return session['period'] === sessionAttendance['period'];
                });
                if(foundSession === -1){
                    attendance[start.toISOString()].push(sessionAttendance);
                } else {
                    attendance[start.toISOString()][foundSession] = sessionAttendance;
                }
            }
        })
        if (isTimeInPeriod === -1) {
            throw new InternalError(9);
        }
        await CourseModel.findOneAndUpdate({ _id: new ObjectID(course_id) }, { $set: { attendance: attendance, lastAttendance: start.toISOString() } }, { upsert: true });
        //return next(new ExternalError(31));
        res.json({success:1});
    } catch (err) {
        console.log(err)
        if (err.is(2)) {
            return next(new ExternalError(25))
        }
        else if (err.is(8)) {
            return next(new ExternalError(84))
        } else if (err.is(9)) {
            return next(new ExternalError(85))
        } else if (err.is(10)) {
            return next(new ExternalError(86))
        }
        else {
            throw err;
        }
    }
}