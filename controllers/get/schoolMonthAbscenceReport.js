'use strict';
const ObjectID = require('mongodb').ObjectID;
const ClassModel = require('../../Models/class').ClassModel;
const CourseModel = require('../../Models/course').CourseModel;

const moment = require('moment-jalaali');

module.exports = async function(req, res, next){
    const schoolID = new ObjectID(req.data._id);
    const date = moment(req.params.date);
    try {
        const classes = await ClassModel.find({school_id: schoolID}, 0, 1000000, {_id: 1});
        let courses = await Promise.all(classes.map(clas=>(CourseModel.find({class_id: clas._id}, 0, 1000000, {students: 1, attendance: 1}))))
        courses = [].concat.apply([], courses);
        let abscents = {};
        courses.map(course=>{
            for (let session in course.attendance){
                const sessionDate = moment(session);
                if(sessionDate.jMonth() === date.jMonth()){
                    course.attendance[session].map(el=>{
                        const abs = course.students.length - el.present.length;
                        const dayStart = sessionDate.startOf('jDay').toISOString();
                        if(!abscents[dayStart]){
                            abscents[dayStart] = 0;
                        }
                        abscents[dayStart] += abs;                        
                    })
                }
            }
        })
        res.json(abscents);
    } catch(err) {
        console.log(err);
    }
}