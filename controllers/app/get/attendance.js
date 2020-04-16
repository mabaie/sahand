'use strict';
const CourseModel = require('../../../Models/course').CourseModel;
const moment = require('moment');

module.exports = async function(req, res, next){
    const studentID = req.params.id;
    const courses = await CourseModel.find({students: studentID}, 0, 100000, {attendance: 1, periods: 1, coname: 1});
    let attendanceReport = [];
    courses.map(course=>{
        if(course['attendance']){
            let courseAttendance = {ID: course._id, Name: course['coname']}
            const attendance = course['attendance'];
            for(let date in attendance ){
                courseAttendance[date] = [];
                const day = 'day' + ((moment(date).day() + 1) % 7);
                for(let session of attendance[date]){
                    let sessionAttendance={present: session['present'].indexOf(studentID)!==-1, sessionPeriod: course['periods'][day][session.period]}
                    courseAttendance[date].push(sessionAttendance);
                }
            }
            attendanceReport.push(courseAttendance)
        }
    })
    res.json(attendanceReport);
}