'use strict';
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-jalaali');
const CourseModel = require('../../Models/course').CourseModel;

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
        let out = {};
        courses.map(course => {
            for (let session in course.attendance) {
                const sessionDate = moment(session);
                if (sessionDate.jYear() === date.jYear()) {
                    course.attendance[session].map(el => {
                        const sessionDay = sessionDate.startOf('jMonth').toISOString();
                        if (!out[sessionDay]) {
                            out[sessionDay] = 0;
                        }
                        out[sessionDay] += course.students.length - el.present.length;
                    })
                }
            }
        })
        res.json(out);
    } catch (err) {
        console.log(err);
    }
}