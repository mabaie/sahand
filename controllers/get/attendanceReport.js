'use strict';
const CourseModel = require('../../Models/course').CourseModel;
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');

module.exports = async function(req, res, next){
    const courseID = req.params.course_id;
    const date = new Date(parseInt(req.params.date));
    const courses = await CourseModel.find({_id: new ObjectID(courseID)}, 0, 100000);
    let attendance = courses[0].attendance;
    for(let a in attendance){
        //console.log(date.toISOString(),a)
        if(date.toISOString().substr(0,10) !== a.substr(0,10))
            delete attendance[a];
    }
    res.json(attendance);
}