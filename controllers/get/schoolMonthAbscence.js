'use strict';
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-jalaali');
const InternalError = require('../../Models/Error/Internal');
const ExternalError = require('../../Models/Error/External');
const CourseModel = require('../../Models/course').CourseModel;

module.exports = async function (req, res, next){
    const course_id = new ObjectID(req.params.id);
    const date = moment(req.params.date);
    let out ={};
    try{
        const course = (await CourseModel.findOne({_id: course_id}))[0];
        const studentCount = course.students.length;
        for (let session in course.attendance){
            let sessionDate = moment(session);
            if(sessionDate.jMonth() === date.jMonth()){
                course.attendance[session].forEach(el=>{
                    const sessionDay = sessionDate.startOf('jDay').toISOString(); 
                    if(!out[sessionDay]){
                        out[sessionDay] = 0;
                    }
                    const abscentCount = studentCount - el.present.length;
                    out[sessionDay]+=abscentCount;
                })
            }
        }
        res.json(out);
    } catch (err) {
        console.log(err);
        if (err instanceof InternalError) {
            if(err.is(2)){
                return next(new ExternalError(25));
            } else {
                return next(new Error());
            }
        } else {
            return next(new Error());
        }
    }
}