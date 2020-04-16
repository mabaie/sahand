'use strict';
const CourseModel = require('../../../Models/course').CourseModel;
const ObjectID = require('mongodb').ObjectID;
const ExternalError = require('../../../Models/Error/External');
const InternalError = require('../../../Models/Error/Internal');
const moment = require('moment');
const _ = require('lodash');

module.exports = async function (req, res, next) {
    const body = req.body.valid.value;
    try {
        let course = await CourseModel.findOne({ _id: new ObjectID(body.course_id) })
        course = course[0];
        let attendance = course['attendance'] ? course['attendance'] : {};
        let now = moment(new Date());
        const day = 'day' + (now.day() + 1 % 7);
        now = moment(now.format('HH:mm'), 'HH:mm');
        if (!course.periods[day]) {
            throw new InternalError(9);
        }
        const periods = course.periods[day];
        let isTimeInPeriod = -1;
        periods.map((period, id) => {
            const start = moment(period.start, 'HH:mm');
            const end = moment(period.end, 'HH:mm');
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
        await CourseModel.findOneAndUpdate({ _id: new ObjectID(body.course_id) }, { $set: { attendance: attendance, lastAttendance: start.toISOString() } }, { upsert: true });
        return next(new ExternalError(31));
    } catch (err) {
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